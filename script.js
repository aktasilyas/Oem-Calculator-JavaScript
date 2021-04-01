//Storage Controller
const StorageController = (function () {
    //private


    //public
    return {

    }
})()


//Product Controller

const ProductController = (function () {
    //private

    const Product = function (id, name, price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    const data = {
        products: [],
        selectedProduct: null,//secilen product'i tutacak
        totalPrice: 0
    }
    //public
    return {
        getProducts: function () {
            return data.products;
        },
        getData: function () {
            return data;
        },
        addProduct: function (name, price) {
            let id ;

            if(data.products.length>0){
                id=data.products[data.products.length-1].id+1;
            }else{
                id=1;
            }

            var product = new Product(id, name, parseFloat(price));
            data.products.push(product);
            return product;
        },
        getTotal: function () {
            var total = 0;
            data.products.forEach(function (item) {
                total += item.price;
            })
            data.totalPrice = total;
            return data.totalPrice;
        },
        getProductById:function (id) {

            var p=null;
            data.products.forEach(product=>{

                if(product.id==id){
                    p=product;
                }
            })

            return p;
            
        },
        SetCurrentProduct:function (product) {
            data.selectedProduct=product;
            
        },
        getCurrentProduct:function(){
            return data.selectedProduct;
        }
    }
})()

//UI Controller
const UIController = (function () {
    //private
    const Selector = {
        productList: "#list",
        addSubmit: '.addSubmit',
        editButon:'#editButon',
        btnSaveChanges:'#btnSaveChanges',
        btnDelete:'#btnDelete',
        btnCancel:'#btnCancel',
        productName: '#name',
        productPrice: '#price',
        productCard: '#productCard',
        totalTl: '#totalTl',
        totalDolar: '#totalDolar'
        

    }




    //public
    return {
       
        ProductList: function (products) {
            var html = "";
            products.forEach(product => {
                html +=
                    `
                  <tr>
                     <td>${product.id}</td>
                     <td>${product.name}</td>
                     <td>${product.price} $</td>
                     <td class="text-right">
                        <button dataId=${product.id} class="btn btn-warning btn-sm editButon">
                          <i  dataId=${product.id} class="far fa-edit"></i>
                        </button>
                     </td>
                  
                  </tr>
                `
            });

            document.querySelector(Selector.productList).innerHTML = html;
        },
        getSelector: function () {
            return Selector;

        },
        addProduct:function (product) {

            document.querySelector(Selector.productCard).style.display = 'block';
                 var html =
                `
                    <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.price} $</td>
                    <td class="text-right">
                        <i  dataId=${product.id} class="far fa-edit"></i>
                  
                    </td>
                
                </tr>
           `;

            document.querySelector(Selector.productList).innerHTML += html;
            
        },
        showTotal: function (total) {
            document.querySelector(Selector.totalTl).textContent=total*4.5;
            document.querySelector(Selector.totalDolar).textContent = total;

          



        },
        clearInput: function () {
            document.querySelector(Selector.productName).value = '';
            document.querySelector(Selector.productPrice).value = '';

        },
        hideCard: function () {
            document.querySelector(Selector.productCard).style.display = 'none';

        },
        inputFull:function (product) {
            document.querySelector(Selector.productName).value=product.name;
            document.querySelector(Selector.productPrice).value=product.price;
        },
        addProductToForm:function () {
            let selectedProduct=ProductController.getCurrentProduct();
            document.querySelector(Selector.productName).value=selectedProduct.name;
            document.querySelector(Selector.productPrice).value=selectedProduct.price;
        },
        addingState:function () {
            UIController.clearInput();
            document.querySelector(Selector.addSubmit).style.display='inline';
            document.querySelector(Selector.btnSaveChanges).style.display='none';
            document.querySelector(Selector.btnDelete).style.display='none';
            document.querySelector(Selector.btnCancel).style.display='none';
        },
        editState:function (tr) {
           
            const parent=tr.parentNode;
            for(let i=0;i<parent.children.length;i++){
                parent.children[i].classList.remove('bg-warning');
            }
            tr.classList.add('bg-warning');
            document.querySelector(Selector.addSubmit).style.display='none';
            document.querySelector(Selector.btnSaveChanges).style.display='inline';
            document.querySelector(Selector.btnDelete).style.display='inline';
            document.querySelector(Selector.btnCancel).style.display='inline';
        }

    }
})()

//App Controller
const App = (function (ProductCtrl, UICtrl) {
    //private
    const Loader = function () {
        const selector=UICtrl.getSelector();
        document.querySelector(selector.addSubmit).addEventListener('click', addSubmit);
        document.querySelector(selector.productList).addEventListener('click', editProduct);
        document.querySelector(selector.btnSaveChanges).addEventListener('click',SaveChanges);
       

    }
  
     //add product
   const addSubmit= function (e) {
        var name = document.querySelector(UICtrl.getSelector().productName).value;
        var price = document.querySelector(UICtrl.getSelector().productPrice).value;
        if (name !== '' && price !== '') {

          // eger bir kayit yoksa tabloyu gosterme
           const newProduct= ProductCtrl.addProduct(name, price);
          

           //add product
            UICtrl.addProduct(newProduct);
            //add total Tl&Dolar
             const total = ProductCtrl.getTotal();
            UICtrl.showTotal(total);

           
            //clear input
             UICtrl.clearInput();


        } else {

            alert('gerekli alanlari doldurun...');
        }


        e.preventDefault();


    }
  
      //edit product
      const editProduct=function(e) {

      
     
       if(e.target.classList.contains('fa-edit')){
       
           const id=e.target.getAttribute('dataId');
           const p=ProductCtrl.getProductById(id);
          
           ProductCtrl.SetCurrentProduct(p);
           UICtrl.addProductToForm();
           const tr=e.target.parentNode.parentNode;
            UICtrl.editState(tr);
       }
      

        e.preventDefault();
        
    }
    //save changes
    const SaveChanges=function (e) {
        
       
         console.log("btn clicked");
        e.preventDefault();
    }
    //public
    return {
        init: function () {
            UICtrl.addingState();
            const products = ProductCtrl.getProducts();
            if (products.length == 0) {

                UICtrl.hideCard();

            } else {
                UICtrl.ProductList(products);
            }
            Loader();
        }

    }
})(ProductController, UIController)


App.init();