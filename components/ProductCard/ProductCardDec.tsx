import { ProductVariant } from "@/types/products";

function ProductCardDec({variant,title}:{
    variant : ProductVariant[];
    title:string
}) {
  return (
        <div className="px-1 py-5">
        <p className="mb-1 text-foreground ">{title}</p>
        <p className="text-muted-foreground text-sm py-2">سایز های موجود :
            {variant.map(item=>(
                    <span key={item.id}> {item.size_name} </span>      
            ))}
             </p>
        <p
          className="text-sm text-muted-foreground ">
          {variant[0].price.toLocaleString("fa-IR")} تومان 
        </p>
      </div>
  )
}

export default ProductCardDec