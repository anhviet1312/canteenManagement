from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Category, Product, Recipe, Material

router = APIRouter(prefix="/api/menu", tags=["menu"])

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
