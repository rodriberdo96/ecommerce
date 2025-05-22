
import {useContext} from 'react'
import ShopContext from '../context/shopcontext'  
import './Css/Product.css'
import { useParams } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb.jsx'
import ProductDisplay from '../components/ProductDisplay/ProductDisplay.jsx'
import DescriptionBox from '../components/DescriptionBox/DescriptionBox.jsx'
import RelatedProducts from '../components/RelatedProducts/RelatedProducts.jsx'

const Product = () => {
  const {all_product}=useContext(ShopContext);
  const {productId}=useParams();
  const product=all_product.find((e)=>e.id=== Number(productId));
  return (
    <div>
      <Breadcrumb product={product}/>
      <ProductDisplay product={product}/>
      <DescriptionBox/>
      <RelatedProducts/>
    </div>
  )
}

export default Product