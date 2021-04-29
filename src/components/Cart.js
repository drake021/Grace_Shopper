// import {useRouter} from 'next/router'
// import Link from 'next/link'
import {useState} from 'react'

const Cart  = ({error,products})=>{
    const {token} =  parseCookies()
    const router = useRouter()
    const [cProducts,setCartProduct] = useState(products)
    let price = 0
    if(!token){
        return(
            <div className="center-align">
                <h3>please login to view your cart</h3>
                <Link href="/login"><a><button className="btn #1565c0 blue darken-3">Login</button></a></Link>
            </div>
        )
    }

    const handleRemove = async (pid)=>{
     const res = await fetch(`${baseUrl}/api/cart`,{
           method:"DELETE",
           headers:{
              "Content-Type":"application/json",
              "Authorization":token 
           },
           body:JSON.stringify({
               productId:pid
           })
       })

       const res2 =  await res.json()
       setCartProduct(res2)
    }
    const CartItems = ()=>{
        return(
            <>
              {cProducts.map(item=>{
                price = price + item.quantity * item.product.price
                  return(
                      <div style={{display:"flex",margin:"20px"}} key={item._id}>
                          <img src={item.product.mediaUrl} style={{width:"30%"}}/>
                          <div style={{marginLeft:"20px"}}>
                              <h6>{item.product.name}</h6>
                              <h6>{item.quantity} x  ₹ {item.product.price}</h6>
                              <button className="btn red" onClick={()=>{handleRemove(item.product._id)}}>remove</button>
                          </div>
                      </div>
                  )
              })}
            </>
        )
    }

    const handleCheckout = async (paymentInfo)=>{
        console.log(paymentInfo)
        const res = await fetch(`${baseUrl}/api/payment`,{
            method:"POST",
            headers:{
               "Content-Type":"application/json",
              "Authorization":token 
            },
            body:JSON.stringify({
                paymentInfo
            })
        })
        const res2 = await res.json()
        M.toast({html: res2.mesage,classes:"green "})
        router.push('/')
    }

    const TotalPrice = ()=>{
        return(
            <div className="container" style={{display:"flex",justifyContent:"space-between"}}>
                <h5>total ₹ {price}</h5>
                {products.length != 0
                &&  <StripeCheckout
                name="My store"
                amount={price * 100}
                image={products.length > 0 ? products[0].product.mediaUrl:""}
                currency="INR"
                shippingAddress={true}
                billingAddress={true}
                zipCode={true}
                token={(paymentInfo)=>handleCheckout(paymentInfo)}
                >
                <button className="btn">Checkout</button>
                </StripeCheckout>
                }
              
            </div>
        )
    }
    return(
        <div className="container" >
          <CartItems />
          <TotalPrice />
        </div>

    )
}



    // const res =  await fetch(`${baseUrl}/api/cart`,{
    //     headers:{
    //         "Authorization":token
    //     }
    // });
    // const products =  await res.json()
    // if(products.error){
    //     return {
    //         props:{error:products.error}
    //     }
    // }
    // console.log("products",products)
    // return {
    //     props:{products}
    // }




export default Cart

// let shoppingCart = (function() {
//     cart = [];

//     function Item(name, price, count) {
//         this.name = name;
//         this.price = price;
//         this.count = count;
//       }

//       function saveCart() {
//         sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
//       }

//       function loadCart() {
//         cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
//       }
//       if (sessionStorage.getItem("shoppingCart") != null) {
//         loadCart();
//       }

//       let obj = {};

//       obj.addItemToCart = function(name, price, count) {
//         for(let item in cart) {
//           if(cart[item].name === name) {
//             cart[item].count ++;
//             saveCart();
//             return;
//           }
//         }
//         const item = new Item(name, price, count);
//         cart.push(item);
//         saveCart();
//       }

//       obj.setCountForItem = function(name, count) {
//         for(let i in cart) {
//           if (cart[i].name === name) {
//             cart[i].count = count;
//             break;
//           }
//         }
//       };

//       obj.removeItemFromCart = function(name) {
//         for(let item in cart) {
//           if(cart[item].name === name) {
//             cart[item].count --;
//             if(cart[item].count === 0) {
//               cart.splice(item, 1);
//             }
//             break;
//           }
//       }
//       saveCart();
//     }

//     obj.removeItemFromCartAll = function(name) {
//         for(let item in cart) {
//           if(cart[item].name === name) {
//             cart.splice(item, 1);
//             break;
//           }
//         }
//         saveCart();
//       }

//       obj.clearCart = function() {
//         cart = [];
//         saveCart();
//       }

//       obj.totalCount = function() {
//         let totalCount = 0;
//         for(let item in cart) {
//           totalCount += cart[item].count;
//         }
//         return totalCount;
//       }

//       obj.totalCart = function() {
//         let totalCart = 0;
//         for(let item in cart) {
//           totalCart += cart[item].price * cart[item].count;
//         }
//         return Number(totalCart.toFixed(2));
//       }

//       obj.listCart = function() {
//         let cartCopy = [];
//         for(i in cart) {
//           item = cart[i];
//           itemCopy = {};
//           for(p in item) {
//             itemCopy[p] = item[p];
    
//           }
//           itemCopy.total = Number(item.price * item.count).toFixed(2);
//           cartCopy.push(itemCopy)
//         }
//         return cartCopy;
//       }
//       return obj;
//     })();

//     $('.add-to-cart').click(function(event) {
//       event.preventDefault();
//       const name = $(this).data('name');
//       const price = Number($(this).data('price'));
//       shoppingCart.addItemToCart(name, price, 1);
//       displayCart();
//     });
    
//     // Clear items
//     $('.clear-cart').click(function() {
//       shoppingCart.clearCart();
//       displayCart();
//     });
    
    
//     function displayCart() {
//       const cartArray = shoppingCart.listCart();
//       const output = "";
//       for(let i in cartArray) {
//         output += "<tr>"
//           + "<td>" + cartArray[i].name + "</td>" 
//           + "<td>(" + cartArray[i].price + ")</td>"
//           + "<td><div class='input-group'><button class='minus-item input-group-addon btn btn-primary' data-name=" + cartArray[i].name + ">-</button>"
//           + "<input type='number' class='item-count form-control' data-name='" + cartArray[i].name + "' value='" + cartArray[i].count + "'>"
//           + "<button class='plus-item btn btn-primary input-group-addon' data-name=" + cartArray[i].name + ">+</button></div></td>"
//           + "<td><button class='delete-item btn btn-danger' data-name=" + cartArray[i].name + ">X</button></td>"
//           + " = " 
//           + "<td>" + cartArray[i].total + "</td>" 
//           +  "</tr>";
//       }
//       $('.show-cart').html(output);
//       $('.total-cart').html(shoppingCart.totalCart());
//       $('.total-count').html(shoppingCart.totalCount());
//     }
    
//     // Delete item button
    
//     $('.show-cart').on("click", ".delete-item", function(event) {
//       const name = $(this).data('name')
//       shoppingCart.removeItemFromCartAll(name);
//       displayCart();
//     })
    
    
//     // -1
//     $('.show-cart').on("click", ".minus-item", function(event) {
//       const name = $(this).data('name')
//       shoppingCart.removeItemFromCart(name);
//       displayCart();
//     })
//     // +1
//     $('.show-cart').on("click", ".plus-item", function(event) {
//       const name = $(this).data('name')
//       shoppingCart.addItemToCart(name);
//       displayCart();
//     })
    
//     // Item count input
//     $('.show-cart').on("change", ".item-count", function(event) {
//        const name = $(this).data('name');
//        const count = Number($(this).val());
//       shoppingCart.setCountForItem(name, count);
//       displayCart();
//     });
    
//     displayCart();
