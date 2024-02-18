let myToast = new bootstrap.Toast(document.getElementById('myToast'));
let myToastConfirm = new bootstrap.Toast(document.getElementById('myToastConfirm'));
let nameInput= document.getElementById("idName");
let emailInput= document.getElementById("idEmail");
let phoneNumberInput= document.getElementById("idPhoneNumber");
let addressInput= document.getElementById("idAdress");
let msgNameInput= document.getElementById("idMsgName");
let msgEmailInput= document.getElementById("idMsgEmail");
let msgPhoneNumberInput= document.getElementById("idMsgPhoneNumber");
let msgAdressInput= document.getElementById("idMsgAdress");

let validForm=true;
let myCart=[];
let productsCount=0;
let totalCarrito=0;
let deleteteIdSelection=-1;

const saveLS=()=>{
    var myCartAsString = JSON.stringify(myCart);
    localStorage.setItem("myCart", myCartAsString);
}
const removeLS=()=>{
    localStorage.removeItem("myCart");
}

const resetCart=()=>{
    myCart=[];
    removeLS();
    updateTotal();
    showProductsCart();
}

const validateName = () => {
    let name=nameInput.value; 
    if (verificarNoVacio(name)){
        if(verificarCaracteresAlfabeticos_LM_Espacio(name)){
            if(validarLongitudCadena(nameInput.value, 3, 20)){
                cleanMsgError(nameInput,msgNameInput);
            }
            else {
                let msg="Mínimo 3 caracteres y Máximo 20";
                showMsgError(nameInput,msgNameInput,msg);
                validForm=false;
            }
        }
        else
        {
            let msg="Solo se permiten caracteres alfabéticos y las únicas letras que pueden ser mayúscula son las primeras";
            showMsgError(nameInput,msgNameInput,msg);
            validForm=false;
        }
    }
    else
    {
        let msg="Campo Obligatorio";
        showMsgError(nameInput,msgNameInput,msg);
        validForm=false;
    }
}

const validateAddress = () => {
    let name=addressInput.value; 
    if (verificarNoVacio(name)){        
        if(validarLongitudCadena(addressInput.value, 3, 100)){
            cleanMsgError(addressInput,msgAdressInput);
        }
        else {
            let msg="Mínimo 3 caracteres y Máximo 100";
            showMsgError(addressInput,msgAdressInput,msg);
            validForm=false;
        }       
    }
    else
    {
        let msg="Campo Obligatorio";
        showMsgError(addressInput,msgAdressInput,msg);
        validForm=false;
    }
}

const validatePhoneNumber = () => { 
    let name=phoneNumberInput.value; 
    if (verificarNoVacio(name)){         
        if(validarNumeroEnteroTodos(name)){ 
            cleanMsgError(phoneNumberInput,msgPhoneNumberInput);
        } 
        else {
            let msg="Solo se permiten Valores Numéricos";
            showMsgError(phoneNumberInput,msgPhoneNumberInput,msg);            
        }
    }else{
        let msg="Campo Obligatorio";
        showMsgError(phoneNumberInput,msgPhoneNumberInput,msg);  
    }
}

const validateEmail = () => {
    let email=emailInput.value;
    if (verificarNoVacio(email)){
        if(validarEmail(email)){
            cleanMsgError(emailInput,msgEmailInput);
        }
        else {
            let msg="E-mail inválido";
            showMsgError(emailInput,msgEmailInput,msg);
            validForm=false;
        }
    }else{
        let msg="Campo Obligatorio";
        showMsgError(emailInput,msgEmailInput,msg);
        validForm=false;
    }
}

const validateFechaNacimiento = () => {
    let bd_d=birthDayInput.value;
    if (verificarNoVacio(bd_d)){      
        if(bd_d.length==10)
        {
            cleanMsgError(birthDayInput,msgDateInput);    
        }else{
            let msg="La Fecha tiene que tener exactamente 8 Números";
            showMsgError(birthDayInput,msgDateInput,msg);
            validForm=false;
        }    
    }else{
        let msg="Campo Obligatorio";
        showMsgError(birthDayInput,msgDateInput,msg);
        validForm=false;
    }
}

const validateForm =()=>{
    validForm=true;
    validateEmail();
    validateName();
    validateAddress();
    validatePhoneNumber();
    return validForm;
}

const deleteProduct=(idProduct)=>{
    var newListProducts = myCart.filter(function(objeto) {
        return objeto.id != idProduct;
    });
    myCart=newListProducts;
}

const deleteProductList=(e)=>{
    deleteteIdSelection=e.target.id;
    let selectedProduct = myCart.find(function(objeto) {
        return objeto.id == e.target.id;
      });

    let idMsgToastConfirmDiv=document.getElementById("idMsgToastConfirmDiv");
    idMsgToastConfirmDiv.innerHTML=`Esta seguro que desea Eliminar el contacto <br><strong> ${selectedProduct.title}</strong>`;
    myToastConfirm.show();
}

const confirmDelete=()=>{
    myToastConfirm.hide();
    deleteProduct(deleteteIdSelection);  
    saveLS();  
    updateTotal();
    showProductsCart(); 
    showMessageToast("Producto eliminado exitosamente...");
    if(myCart.length==0)
        previous();
}

const cancelDelete=()=>{
    deleteteIdSelection=-1;
    myToastConfirm.hide();
}

const showMessageToast=(msg)=>{
    let msgToast =document.getElementById("idMsgToast");
    msgToast.innerHTML=msg;
    myToast.show();
}

const cleanForm = () => {
    let submitCartContainer = document.getElementById("submitCartContainer");
    let inputCollection=submitCartContainer.getElementsByTagName("input");
    let errorsCollection=document.getElementsByClassName("erroMessage");
    for (let index = 0; index < inputCollection.length; index++) {
        inputCollection[index].value="";
    }
    for (let index = 0; index < errorsCollection.length; index++) {
        errorsCollection[index].classList.remove("animation");
        errorsCollection[index].classList.add("hidden");
        errorsCollection[index].innerText = "";
    }
}

const showMsgError = (htmlElement,htmlElementMsg, msg) => {
    cleanMsgError(htmlElement,htmlElementMsg);
    if(htmlElement)
        htmlElement.setAttribute('aria-invalid', 'true');
    htmlElementMsg.innerText = msg;
    htmlElementMsg.style.display = "block";
    validForm = false;
    htmlElementMsg.classList.remove("hidden");
    htmlElementMsg.classList.add("animation");
}

const cleanMsgError = (htmlElement,htmlElementMsg) => {
    if(htmlElement)
        htmlElement.setAttribute('aria-invalid', 'false');
    htmlElementMsg.innerText = "";
    htmlElementMsg.style.display = "none";
    htmlElementMsg.classList.remove("animation");
    htmlElementMsg.classList.add("hidden");
}

const updateTotal=()=>{
    let count=0;
    let total=0;
    myCart.forEach(p => {
        count+=p.cant;
        total+=p.price*p.cant;
      });
    let cart=document.getElementById("idTotal"); 
    cart.innerText=`$${convertNumberToString(total)} (${count})`;

    if(count>0) document.getElementById("idTotalBadge").classList.add("titilante");
    else document.getElementById("idTotalBadge").classList.remove("titilante");
}

const createCard=(aProduct)=>{
    let value=`
    <div class="card justify-content-between" style="width: 18rem;">
        <img src="./img/productos/${aProduct.img_name}" class="card-img-top " alt="...">
        <div class="card-body">
            <span class="d-none">${aProduct.id}</span>
            <h5 class="card-title">${aProduct.title}</h5>
            <p class="card-text">${aProduct.short_description}</p>
            <p class="card-text text-end fs-4 text-primary">$${convertNumberToString(aProduct.price)}</p>
            <div class="d-flex justify-content-between">
                <a href="#" class="addProduct btn btn-success">Agregar</a>
                <input class="cant" type="number" value="1" min="1" name="Cant">
            </div>
        </div>
    </div>
    `;
    return value;
}

const addProduct = (e)=>{
    e.preventDefault();
    let productName=(e.target.parentNode.parentNode).querySelector('h5:first-of-type').innerText;
    showMessageToast(`<strong>${productName}</strong> añadido/a al carrito correctamente...<br><hr>Finalizado el pedido pulse en la parte superior del sitio para confirmar el mismo.`);
    let countAdd=(e.target.parentNode).querySelector('input:first-of-type').value;
    let idProducto=(e.target.parentNode.parentNode).querySelector('span:first-of-type').innerText;    
    let newProduct=products.find(p => p.id == idProducto);
    
    //VErifico si ya cargo previamente el producto y actualizo cantidad en tal caso
    const productoUpdate = myCart.find(objeto => objeto.id == idProducto);

    if (productoUpdate) {
      // Actualizar el valor del objeto encontrado
      productoUpdate.cant = parseInt(countAdd);
    } else {
        const np = {
            id:newProduct.id,
            title: newProduct.title,
            price:newProduct.price,
            img_name:newProduct.img_name,
            short_description:newProduct.short_description,
            cant:parseInt(countAdd)
          };
        myCart.push(np);
    }
    
    saveLS();
    updateTotal();
    showProductsCart();
}

const showProducts=(productsJSON)=>{
    productsJSON.sort(function(a, b) {
        return a.title.localeCompare(b.title);
      });
    productsCount=0;
    let productsContainer=document.getElementById("productsContainer");
    let listProducts="";

    productsJSON.forEach(function(objeto) {
        productsCount++;
        listProducts+=createCard(objeto);
    });

    productsContainer.innerHTML=`
    <div id="productsContainer" class="d-flex flex-row flex-wrap justify-content-center"> 
    ${listProducts}
    </div>
    <div class="form-text text-start text-secondary">${productsCount} producto/s</div>`;

    let addButtonCollection=document.getElementsByClassName("addProduct");
    for (let index = 0; index < addButtonCollection.length; index++) {
        addButtonCollection[index].addEventListener('click', addProduct);
    }
}

const crearCartElement=(element)=>{
    let value=`<tr>
        <td class="pt-2 pb-2 text-start d-blue text-wrap">
            <p class="mb-0 fs-4"><strong>${element.title}</strong></p>
            <p class="mb-0">${element.short_description}</p>
        </td>
        <td class="pt-2 pb-2 align-middle text-center">${element.cant}</td>
        <td class="pt-2 pb-2 align-middle text-end">$${convertNumberToString(element.cant*element.price)}</td>
        <td class="pt-2 pb-2 align-middle text-center">
            <i id="${element.id}" class="delete fa-regular fa-trash-can m-1"></i>
        </td>
    </tr>`;
    return value;
}

const showProductsCart=()=>{    

    totalCarrito=0;
    myCart.sort(function(a, b) {
        return a.title.localeCompare(b.title);
      });
    let count=0;
    let myCartContainer=document.getElementById("myCartContainer");
    let listProducts="";

    myCart.forEach(function(objeto) {
        count+=objeto.cant;
        listProducts+=crearCartElement(objeto);
        totalCarrito+=objeto.cant*objeto.price;
    });

    myCartContainer.innerHTML=`
    <div class="table-responsive">
        <table class="table table-hover table-sm">
            <thead>
                <tr class=" fw-normal fs-6 ">
                    <th scope="col" class="text-wrap">Descripción</th>
                    <th scope="col" class="text-center">Cant</th>
                    <th scope="col" class="text-nowrap text-center">Total</th>
                    <th scope="col" class="text-center">Acciones</th>
                </tr>
            </thead>
            <tbody>
                ${listProducts}
                <tr>
                    <td class="pt-2 pb-2 text-start d-blue text-wrap align-middle" ><h2><strong>TOTAL</strong></h3></td>
                    <td class="pt-2 pb-2 align-middle text-end text-danger" colspan="3"><h3>
                        $${convertNumberToString(totalCarrito)}
                        </h3>
                    </td>
                    
                </tr>
            </tbody>
        </table>
        <div  class="form-text text-start text-secondary">${count} producto/s</div>
        
    </div>`;  
    
    let fiDeleteCollection=document.getElementsByClassName("delete");
    for (let index = 0; index < fiDeleteCollection.length; index++) {
        fiDeleteCollection[index].addEventListener('click', deleteProductList);
    }
}

const showResume=()=>{
    let resumeContainer=document.getElementById("resumeContainer");
    myCart.sort(function(a, b) {
        return a.title.localeCompare(b.title);
      });
    let count=0;
    let listProducts="";
    totalCarrito=0;
    myCart.forEach(function(objeto) {
        count+=objeto.cant;
        totalCarrito+=objeto.cant*objeto.price;
        listProducts+=`
        <div class="d-flex justify-content-between">
            <p class="mb-0"><strong>${objeto.title}</strong> (cantidad: ${objeto.cant})</p>            
            <p class="mb-0">$${convertNumberToString(objeto.cant*objeto.price)}</p>
        </div>`        
    });

    resumeContainer.innerHTML=`
    <div class="text-center fs-4 text-primary">
        Descripción del pedido
    </div>
    ${listProducts}
    
    <div class="d-flex  justify-content-between">
        <p><strong>Total</strong></p>            
        <p class="text-danger">$${convertNumberToString(totalCarrito)}</p>
    </div>
    <div class="alert alert-warning text-start" role="alert">
        <h4 class="alert-heading">Datos de Contacto</h4>
        <p class="mb-0"><strong>Nombre y Apellido: </strong>${nameInput.value}</p>
        <p class="mb-0"><strong>Dirección de entrega: </strong>${addressInput.value}</p>
        <p class="mb-0"><strong>Email: </strong>${emailInput.value}</p>
        <p class="mb-0"><strong>Teléfono: </strong>${phoneNumberInput.value}</p>
        <hr>
        <p class="mb-0">Recuerda que no volveremos a pedirte bajo ningun concepto datos personales ni de los medios de pagos utilizados al momento de confirmar el pedido.</p>
    </div>    
    
    `;      
}

const next=()=>{
    let productsContainer=document.getElementById("productsContainer");
    let myCartContainer=document.getElementById("myCartContainer");
    let submitCartContainer=document.getElementById("submitCartContainer");    
    let confirmationContainer=document.getElementById("confirmationContainer");    
    let activeSection=document.getElementById("activeSection");    
    let idTotalBadge=document.getElementById("idTotalBadge");
   
    switch (parseInt(activeSection.innerText)) {
        case 1:
            if(myCart.length>0){
                productsContainer.classList.add("d-none");
                idTotalBadge.classList.add("d-none");
                myCartContainer.classList.remove("d-none");
                submitCartContainer.classList.remove("d-none");              
                activeSection.innerText="2";
                document.documentElement.scrollTop = 0;            
            }
            else{
                showMessageToast("<strong>No hay porductos en el carrito para ordenar</strong>.<br> Agregue productos y vuelva para continuar.")
            }
           
            break;
        case 2:
            if(validateForm())
            {
                myCartContainer.classList.add("d-none");
                submitCartContainer.classList.add("d-none");  
                confirmationContainer.classList.remove("d-none");  
                showResume();
                cleanForm();
                document.documentElement.scrollTop = 0;
                activeSection.innerText="3";
                resetCart();    
            }      
            break;
        case 3:
            productsContainer.classList.remove("d-none");
            idTotalBadge.classList.remove("d-none");
            myCartContainer.classList.add("d-none");
            submitCartContainer.classList.add("d-none");
            confirmationContainer.classList.add("d-none");            
            activeSection.innerText="1";
            document.documentElement.scrollTop = 0;
            break;
    }    
        
}

const previous=()=>{
    let productsContainer=document.getElementById("productsContainer");
    let myCartContainer=document.getElementById("myCartContainer");
    let submitCartContainer=document.getElementById("submitCartContainer");    
    let activeSection=document.getElementById("activeSection"); 
    let confirmationContainer=document.getElementById("confirmationContainer");       
    let idTotalBadge=document.getElementById("idTotalBadge");
   
    switch (parseInt(activeSection.innerText)) {
        case 2:
            productsContainer.classList.remove("d-none");
            idTotalBadge.classList.remove("d-none");            
            myCartContainer.classList.add("d-none");  
            submitCartContainer.classList.add("d-none");  
            activeSection.innerText="1";          
            break;       
    }
    document.documentElement.scrollTop = 0;
}
 
//VERIFICO SI HAY CONTACTOS EN EL LS en el carrito, SINO HAY, CREO CONTACTOS POR DEFAULT PARA MOSTRAR ALGO
if (localStorage.getItem("myCart")) {
    myCart = JSON.parse(localStorage.getItem("myCart"));  
    updateTotal();
    document.getElementById("idTotalBadge").classList.add("titilante");
    showProductsCart();
}
else{
    let cart=document.getElementById("idTotal");
    cart.innerText="$0,00 (0)";
    document.getElementById("idTotalBadge").classList.remove("titilante");
}

showProducts(products);


///////PARA SERVIDOR - PERO EJECUTANDO SIN SERVIDOR JS NO FUNCIONA
//Reading JSON file with products
async function readJSONFile() {
    try {      
        const response = await fetch('./json/productos.json');
        products = await response.json();
        showProducts(products);      
    } catch (error) {
      console.error('Error al leer el archivo JSON:', error);
    }
}

// Llama a la función para iniciar el proceso de lectura
// readJSONFile();