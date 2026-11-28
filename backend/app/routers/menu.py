from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Category, Product, Recipe, Material, AuditLog
from ..schemas import RecipeUpdateRequest
import uuid
from datetime import datetime
from urllib.parse import unquote

router = APIRouter(prefix="/api/menu", tags=["menu"])

def get_current_user_from_header(x_user_role: str = Header(None), x_user_name: str = Header(None)):
    name = unquote(x_user_name) if x_user_name else "Nguyễn Văn Đạt"
    return {
        "role": x_user_role or "CHEF",
        "name": name
    }

@router.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

@router.get("/products")
def get_products(db: Session = Depends(get_db)):
    products = db.query(Product).all()
    materials = {m.id: m for m in db.query(Material).all()}

    results = []
    for p in products:
        recipes_data = []
        bom_cost = 0.0
        for r in p.recipes:
            mat = materials.get(r.material_id)
            mat_cost = mat.avg_cost if mat else 0
            cost = r.quantity * mat_cost
            bom_cost += cost
            recipes_data.append({
                "material_id": r.material_id,
                "material_name": mat.name if mat else r.material_id,
                "unit": mat.unit if mat else "kg",
                "quantity": r.quantity,
                "avg_cost": mat_cost,
                "amount": cost
            })

        results.append({
            "id": p.id,
            "code": p.code,
            "name": p.name,
            "category_id": p.category_id,
            "price": p.price,
            "cost_price": bom_cost if bom_cost > 0 else p.cost_price,
            "is_meal_eligible": p.is_meal_eligible,
            "image": p.image,
            "recipes": recipes_data
        })
    return results

@router.put("/recipes/{product_id}/{material_id}")
def update_recipe(
    product_id: str,
    material_id: str,
    req: RecipeUpdateRequest,
    user_info: dict = Depends(get_current_user_from_header),
    db: Session = Depends(get_db)
):
    if user_info["role"] not in ["CHEF", "ADMIN"]:
        raise HTTPException(
            status_code=403,
            detail="Chỉ Bếp trưởng (CHEF) mới có thẩm quyền điều chỉnh định mức BOM nguyên vật liệu."
        )

    recipe = db.query(Recipe).filter(
        Recipe.product_id == product_id,
        Recipe.material_id == material_id
    ).first()

    product = db.query(Product).filter(Product.id == product_id).first()
    material = db.query(Material).filter(Material.id == material_id).first()

    prod_name = product.name if product else product_id
    mat_name = material.name if material else material_id
    unit = material.unit if material else "kg"

    if not recipe:
        recipe = Recipe(
            id=f"rec-{uuid.uuid4().hex[:8]}",
            product_id=product_id,
            material_id=material_id,
            quantity=req.quantity
        )
        db.add(recipe)
        old_qty = 0.0
    else:
        old_qty = recipe.quantity
        recipe.quantity = req.quantity

    # Ghi nhận Audit Log
    log = AuditLog(
        id=f"log-{uuid.uuid4().hex[:8]}",
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        user_info=f"{user_info['name']} (Bếp trưởng)",
        action="ĐIỀU_CHỈNH_BOM",
        target=f"{prod_name} -> {mat_name}",
        details=f"Định mức cũ: {old_qty} {unit}, Định mức mới: {req.quantity} {unit}."
    )
    db.add(log)
    db.commit()

    return {
        "status": "success",
        "message": f"Đã cập nhật định mức {mat_name} cho món {prod_name} thành {req.quantity} {unit}."
    }

