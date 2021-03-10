
window.onload = function(){

    //smestanje podataka iz json fajlova u localStorage
    //navigation.json
    ajaxCallBack("navigation", (result)=>{
        printNavigation(result)
        
    })
    //socialMediasFooter.json
    ajaxCallBack('socialMediasFooter', (result)=>{
        printFooterMenu(result)
    })
    //authors.json
    ajaxCallBack("authors", function(result){
        setItemLocalStorage("authors",result)
        printAuthors(result)
    })
    //publishers.json
    ajaxCallBack("publishers", (result)=>{
        setItemLocalStorage("publishers", result)
        printPublishers(result)
    })
    //categories
    ajaxCallBack("categories", (result)=>{
        setItemLocalStorage("categories", result)
        printCategories(result)
    })
    //books
    ajaxCallBack("books", (result)=>{
        setItemLocalStorage('books', result)
        printNewBooks(result)
        printSpecialOffers(result)
        printAllBooks(result)
    })

    //ajax call back funkcija 
    function ajaxCallBack(file, result){ 
        $.ajax({
                url: "assets/data/" + file + ".json",
                method: "get", 
                dataType: "json", 
                success: result,
                error: function(err){console.log(err)}
                })
    }

    //funkcija za skladistenje podataka u localStorage
    function setItemLocalStorage(itemKey, itemValue){
        localStorage.setItem(itemKey, JSON.stringify(itemValue))
    }

    //funkcija za dohvatanje skladistenih podataka iz localStorage-a
    function getItemLocalStorage(itemKey){
        return  JSON.parse(localStorage.getItem(itemKey))
    }


    //promenljive u koje se smestaju podaci dohvaceni iz localStorage-a
    var authors = getItemLocalStorage("authors");
    var publishers = getItemLocalStorage("publishers");
    var categories = getItemLocalStorage("categories");
    var books = getItemLocalStorage("books");
     

    $(".search").keyup(filterBooks)

    $("#sort").change(filterBooks)
    
    $("#filterAuthors").change(filterBooks)

    $("#filterCategories").change(filterBooks)
    $("#filterPublishers").change(filterBooks)
    
    $("#filterSpecialOffers").change(filterBooks)

    $(document).on("click", '.bookImage', (e)=>{
        e.preventDefault();
         stop(true, true)
         let target = e.target.parentElement
         let dataTarget = target.dataset.target;
         printSingleProduct(dataTarget)
    })
   
    $(document).on("click", ".addToCartBooks, .addToCart", (e)=>{
        e.preventDefault();
        stop(true, true);
        let target = e.target.dataset.cart
        numberOfProductsInCart();
        productsInCart(target)
        printModalForCart(target);
    })

    //inkrementiranje
    $(document).on("click", '.qty-plus', (e)=>{
        let bookId = parseInt(e.target.parentElement.parentElement.parentElement.dataset.book);
        let products = getItemLocalStorage('products')
        let productsInCart = getItemLocalStorage('numberOfProductsInCart');
        for(let p of products){
            if(bookId == p.id){
                if(p.quantity < 20){
                    p.quantity += 1;
                    productsInCart += 1
                }
            }
        }
        setItemLocalStorage('numberOfProductsInCart', productsInCart)
        printNumberOfProductsInCart()
        setItemLocalStorage('products', products)
        printCart()

    })
    
    //dekrementiranje
    $(document).on("click", '.qty-minus', (e)=>{
        let bookId = parseInt(e.target.parentElement.parentElement.parentElement.dataset.book);
        let products = getItemLocalStorage('products')
        let productsInCart = getItemLocalStorage('numberOfProductsInCart');
        for(let p of products){
            if(bookId == p.id){
               if(p.quantity > 1){
                p.quantity -= 1;
                productsInCart -= 1
               }
            }
        }
        setItemLocalStorage('numberOfProductsInCart', productsInCart)
        printNumberOfProductsInCart()
        setItemLocalStorage('products', products)
        printCart()

    })

    //brisanje knjige iz korpe
    $(document).on("click", '.remove', (e)=>{
        let bookId = parseInt(e.target.parentElement.parentElement.dataset.book);
        let products = getItemLocalStorage('products')
        let productsInCart = getItemLocalStorage('numberOfProductsInCart');
        for( let p of products){
            if(p.id == bookId){
                productsInCart -= p.quantity;
                products.splice(products.indexOf(p), 1)
            }
        }
        setItemLocalStorage('numberOfProductsInCart', productsInCart)
        printNumberOfProductsInCart()
        setItemLocalStorage('products', products)
        printCart()
    })

    //back to shopping button u korpi
    $(document).on("click", '.btnCartShopping', (e)=>{
        e.preventDefault();
        stop(true, true);
        window.location.href = 'products.html'
    })

    //setovanje broja proizvoda u korpi, local storage
    function numberOfProductsInCart(){
        let products;
        if(localStorage){
            products = getItemLocalStorage('numberOfProductsInCart');
            if(products){
               setItemLocalStorage("numberOfProductsInCart", products + 1)
            }
            else{
                setItemLocalStorage("numberOfProductsInCart",1)
            }
            printNumberOfProductsInCart();
        }

    }

    //ispisivanje broja proizvoda u korpi u navigaciji iznad ikonice za korpu
    function printNumberOfProductsInCart(){
        let products;
        if(localStorage){
            products = getItemLocalStorage('numberOfProductsInCart')
            if(products){
                $(".productsInCart").html(products)
            }
            else{
                $(".productsInCart").html('0')
            }
        }
    }

    //skladistenje proizvoda u korpu
    function productsInCart(target){
        let products = getItemLocalStorage('products');
        let product;
        for(let book of books){
            if(target == book.id){
                product = {
                    id: book.id,
                    name: book.name,
                    quantity: 1
                }
            }
        }
        if(localStorage){
            if(products != null){
                let doesntExist;
                let ids = [];
                for(let p of products){
                    ids.push(p.id)
                }

                if(ids.includes(product.id)){
                    for(let p of products){
                        if(p.id == product.id){
                            p.quantity += 1;
                        }
                    }
                    doesntExist = false;
                }
                else{
                    doesntExist = true;
                }
                if(doesntExist){
                    products.push(product)
                }
                setItemLocalStorage('products', products)
            }
            else{
                setItemLocalStorage('products', [product])
            }
        }
    }
    
    printCart()
    function printCart(){
        $("#cartTable").html(printCartProducts(getItemLocalStorage('products')))
        $("#cartTable tbody tr:even").addClass("tableZebra")
    }
    

    //ispisvanje proizvoda u korpi na stranici cart.json
    function printCartProducts(products){
        //console.log(products)
        if(products != null && products.length != 0){
            let html = `<thead>
                            <tr>
                                <td class="cart-product text-center">product</td>
                                <td class="cart-price text-center" >price</td>
                                <td class="cart-quantity text-center">quantity</td>
                                <td class="cart-total text-center">total</td>
                                <td class="cart-remove text-center">remove</td>
                            </tr>
                        </thead>
                        <tbody>`;
                        
            for(let p of products){
                html += `<tr data-book='${p.id}'>
                        <td>
                            <div class='row'>
                                <div class='col-lg-6 col-12 text-center'>${fetchImageForCart(p.id)}</div>
                                <div class='col-lg-6 col-12 text-lg-left text-center mt-3'>${p.name} <p>by: ${fetchAutorCart(p.id)}</p></div>
                            </div> 
                        </td>
                <td class="cart-price text-center">$${fetchPriceCart(p.id)}</td>
                <td class="cart-quantity row pt-3 mt-5 mt-lg-1">
                 <div class='col-6 text-right mt-3'>${p.quantity}</div>
                  <div class='cartQuantity col-6 text-left'>
                  <button class=" qty-plus ml-1">+</button> <button class="ml-1 qty-minus">-</button>
                  </div>
                </td>
                <td class="cart-total text-center">$${totalPrice(fetchPriceCart(p.id), p.quantity)}</td>
                <td class="cart-remove text-center"><button class="remove">remove</button></td>
            </tr>`
            }
            html += `<tr><td colspan='5'><p class='text-right mt-3'><span class='font-weight-bold'> Total: </span>$${totalPriceOfProducts(products)}</p>
            <p class='text-right'><button class="text-uppercase btnBuy">buy</button></p></td></tr></tbody>`
            return html
        }
        else {
            return `<h3>Your cart is empty</h3>
                    <button class='btnCartShopping mt-5'>Continue shopping</button>`

                        
        }
    }

    function totalPriceOfProducts(products){
        let total = 0;
        for(let p of products){
            total = total + parseFloat(totalPrice(fetchPriceCart(p.id), p.quantity))
        }
        
        return total.toFixed(2)
    }

    //racunanje ukupne cene za ispis knjiga u korpu
    function totalPrice(price, quantity){
        return (price * quantity).toFixed(2)
    }

    //dohvatanje cene za ispis knjiga u korpu
    function fetchPriceCart(bookId){
        for(let b of books){
            if(b.id == bookId){
               return b.price.new
            }
        }
    }

    //dohvatanje autora za ispis knjiga u korpu
    function fetchAutorCart(bookId){
        for( let b of books){
            if(b.id == bookId){
               return fetchAutor(b.author)
            }
        }
    }

    //dohvatanje slike za ispis knjiga u korpu
    function fetchImageForCart(bookId){
        for( let b of books){
            if(b.id == bookId){
                return `<img src="${b.thumbnail.src}" alt="${b.thumbnail.alt}" class='img-fluid'>`
            }
        }
    }

    
    

    //ispisivanje navigacije
    function printNavigation(data){
        let html = '';
        for(let link of data){
            html += `<li class="nav-item text-right">
                        <a class="nav-link" href="${link.href}">${link.linkName}</a>
                     </li>`
        }
        html += `<li class="nav-item cartIcon text-right"><a class="nav-link" href="cart.html"><i class="fa fa-shopping-cart" aria-hidden="true"></i></a><span class="productsInCart"></span></li>`
        $("#navigation").append(html)
        printNumberOfProductsInCart();
    }
    
    

    //ispisivanje menija iz footera
    function printFooterMenu(data){
        let html = '';
         for(let link of data){
             html += `<li><a href="${link.href}" target="blank">${link.icon}</a></li>`
        }
        $(".social").html(html)
    }

    //ispisivanje autora za filtriranje
    function printAuthors(data){
        let html = '';
        for(let author of data){
            html += `<li class="form-group col-6 col-lg-12">
            <input type="checkbox" name="${author.name}" class="author" value="${author.id}"> ${author.name}
          </li>`;
        }
        html += '<hr/>'
        $("#filterAuthors").append(html)
    }

    //ispisivanje kategorija za filtriranje 
    function printCategories(data){
        let html = '';
        for(let category of data){
            html += `<li class="form-group col-6 col-lg-12">
            <input type="checkbox" name="${category.name}" class="category" value="${category.id}"> ${category.name}
          </li>`;
        }
        html += '<hr/>'
        $("#filterCategories").append(html)
    }

    //ispisivanje izdavaca za filtriranje
    function printPublishers(data){
        let html = '';
        for(let publisher of data){
            html += `<li class="form-group col-6 col-lg-12">
            <input type="checkbox" name="${publisher.name}" class="publisher" value="${publisher.id}"> ${publisher.name}
          </li>`;
        }
        html += '<hr/>';
        $("#filterPublishers").append(html)
    }

    //ispisivanje novih knjiga
    function printNewBooks(data){
        data = data.filter((el)=>{
            if(el.new) return el;
        })
        let html = printBooks(data) //funkcija koja vraca kod koji je potreban za ispisvanje knjiga
        $("#newBooks").append(html)
    }

    //ispisivanje specijalnih ponuda
    function printSpecialOffers(data){
        data = filterSpecialOffers(data)
        let html = printBooks(data)
        $("#specialOffers").html(html)
    }
    
    //ispisivanje svih knjiga na stranici products.html
    function printAllBooks(data){
        data = sort(data)
        data= filtering(".author", data)
        data = filtering(".category", data)
        data = filtering(".publisher", data)
        data = filterBySearch(data)
        data = filterSpecialOffersProducts(data)
        let html = printBooks(data);
        $("html, body").animate({scrollTop: 0}, 800)
        $("#products").html(html);
        
    }

    //funkcija za ispisivanje modala koji iskace nakon sto je proizvod dodat u korpu
    function printModalForCart(target){
        let singleBook = books.filter(function(el){
            if(target == el.id) return el;
        })
        let html = '';
        for(let book of singleBook){
            html += `<div class=" modalCart text-center text-lg-left">
            <h6>The book has been added to cart</h6>
            <div class="row">
                <div class="col-lg-4">
                    <img src="${book.thumbnail.src}" alt="${book.thumbnail.alt}" class="img-fluid">
                </div>
                <div class="col-lg-8">
                    <p>${book.name}</p>
                    <p>${fetchAutor(book.author)}</p>
                    <p>$${book.price.new}</p>
                <button class="goToCart mb-3">Go to cart</button>
                <button class="backToSopping">Continue shopping</button>
                </div>
            </div>
        </div>`;
        }
        $(".modal").html(html)
        $("body").addClass("overflow");
        $(".modal").addClass("show").animate({opacity: "1"}, 300)
        $(".backToSopping").click((e)=>{
            
            e.preventDefault();
            stop(true, true);
            $(".modal").animate({opacity: "0"}, 500, function(){
                $(".modal").removeClass("show");
            });
            if(!($(".singleProduct").hasClass("show"))){
                $("body").removeClass("overflow")
            }
        })
        $(".goToCart").click((e)=>{
            e.preventDefault();
            stop(true, true);
            let location = window.location.href;
            let cartLocation = location.substr(0, location.lastIndexOf("/")+1) + 'cart.html'
            window.location.href=cartLocation;
        })
    }

//funkcije za filtriranje, sortiranje i pretragu

    function filterBooks(){
        printAllBooks(books)
     }

    //sortiranje
    function sort(data){
        let selectedPrice = $("#price").val();
        let selectedTitle = $("#title").val()
        if(selectedPrice != 0){
            if(selectedPrice == 'asc'){
                data = data.sort(function(a, b){ 
                    if(a.price.new > b.price.new) return 1;
                    else if(a.price.new < b.price.new) return -1;
                    else return 0
                })
            }
            else{
                data = data.sort(function(a, b){ 
                    if(a.price.new > b.price.new) return -1;
                    else if(a.price.new < b.price.new) return 1;
                    else return 0
                })
            }
        }
        
        if(selectedTitle != 0){
            if(selectedTitle == 'az'){
                data = data.sort(function(a, b){
                    if(a.name.toUpperCase() > b.name.toUpperCase()) return 1;
                    else if(a.name.toUpperCase() < b.name.toUpperCase()) return -1;
                    else return 0;
                })
            }
            else{
                data = data.sort(function(a, b){
                    if(a.name.toUpperCase() > b.name.toUpperCase()) return -1;
                    else if(a.name.toUpperCase() < b.name.toUpperCase()) return 1;
                    else return 0;
                })
            }
        }
        

        return data 
    }

    //filtriranje po autoru, kategoriji ili izdavacu
    function filtering(classOfElements, data){
        let selected = [];
        for(let element of document.querySelectorAll(classOfElements)){
            if(element.checked) selected.push(parseInt(element.value))
        }
        if(selected.length != 0){
            data = data.filter(function(el){
                for(let s of selected){
                    if(classOfElements == '.author'){
                        if(el.author == s) return el
                    }
                    else if(classOfElements == '.category'){
                        if(el.category == s) return el;
                    }
                    else if(classOfElements == '.publisher'){
                        if(el.publisher == s) return el
                    }
                }
            })
            
        }
        return data
    }

    //filtriranje po retrazi po naslovu
    function filterBySearch(data){
        let input = $(".search").val();
        let url = window.location.href;
        let currentPage = url.substr(url.lastIndexOf("/")+1, url.length)
        if(input != '' && currentPage == 'products.html') {
            data = data.filter(function(el){
                if(el.name.toUpperCase().includes(input.toUpperCase())) return el;
            });
        }
        return data
    }

    //filtriranje na stranici products.html
    function filterSpecialOffersProducts(data){
        if($(".spOffers").is(":checked")){
            data = filterSpecialOffers(data)
        }
        return data
    }

    //html kod za ispis knjiga
    function printBooks(data){
        if(data.length == 0){
            return '<h4 class="m-auto">Sorry, no results...</h4>'
        }
        else{
            let html = "";
            for(let book of data){
                html += `<div class="book text-center col-lg-3 col-md-4 col-sm-6 col-12 ">
                <div class="bookImage mb-2">
                ${fetchSpecialOffers(book.specialOffer)}
                    <a href="#" data-target="${book.id}" class="bookImageLink">
                        <img src="${book.thumbnail.src}" alt="${book.thumbnail.alt}">
                    </a>
                </div>
                <div class="bookTitle">
                    <h3>${book.name}</h3>
                </div>
                <p class="bookAuthor">by ${fetchAutor(book.author)}</p>
                <p class="bookCategory">${fetchCategpory(book.category)}</p>
                <div class="bookPrice">
                    ${fetchPrice(book.price)}
                </div>
                <p class="freeShipping">
                   ${freeShipping(book.freeShipping)}
                </p>
                <button class="addToCartBooks mt-auto" data-cart="${book.id}">add to cart</button>
            </div>`
            }
            return html;
        }
        
    }

//funkcije za dohvatanje podataka koji su potrebni za ispis svih knjiga
    //dohvatanje specijalnih ponuda za ispisivanje knjiga
    function fetchSpecialOffers(data){
        if(data) return `<p class="specialOffer text-center">special</br>offer</p>`;
        else return ''
    }

    //dohvatanje autora za ispisivanje knjiga
    function fetchAutor(id){
        for(let author of authors){
            if(id == author.id) return author.name
        }
    }

    //dohvatanje kategorije za ispisivanje knjiga
    function fetchCategpory(id){
        for(let category of categories){
            if(id == category.id) return category.name
        }
    }

    //dohvatanje cena za ispisivanje knjiga
    function fetchPrice(prices){
        if(prices.old) return `<span>$${prices.new}</span>
        <del  class="ml-1">$${prices.old}</del>`;
        else return `<span>$${prices.new}</span>`;
    }

    //dohvatanje besplatne dostave za ispisivanje knjiga
    function freeShipping(data){
        if(data) return ` <i class="fa fa-truck mr-2" aria-hidden="true"></i>Free shipping`
        else return ''
    }

    //filtriranje za specijalnu ponudu
    function filterSpecialOffers(data){
        data = data.filter(function(el){
            if(el.specialOffer) return el
        })
        return data
    }




//funkcije za ispisivanje jednog proizvoda
     function printSingleProduct(dataTarget){
         let singleBooks = books.filter(function(el){
             if(dataTarget == el.id) return el;
         })

         let html = '';
         for(let book of singleBooks){
             html += `<div class="container m-auto row singleProductContent pt-5">
             <div class="col-sm-5 spimage text-center">
               <img src="${book.image.src}" alt="${book.image.alt}" class='img-fluid' >
               ${specialOfferSingleProduct(book.specialOffer)}
             </div>
             <div class="col-md-6 col-10 text-left">
               <h3 class="mb-3">${book.name}</h3>
               <p>${fetchCategpory(book.category)}</p>
               <div class="authorPublisher mt-2 mb-3">
                 <span>Author: ${fetchAutor(book.author)}</span><br>
                 <span>Publisher: ${fetchPublisher(book.publisher)}</span>
               </div>
               <p>${book.description}</p>
               ${priceSingleProduct(book.price)}
               <button class="addToCart mb-2" data-cart='${book.id}'>Add to cart</button>
               ${freeShippingSingleProduct(book.freeShipping)}
             </div>
             <div class="col-1 text-right">
               <button class="close" id="btnClose">
                 <i class="fa fa-times " aria-hidden="true"></i>
                 </button>
             </div>
           </div>` 
         }
         $(".singleProduct").html(html)
         $("body").addClass("overflow");
         $(".singleProduct").addClass("show").animate({opacity: "1"}, 500)
         $("#btnClose").click((e)=>{
            e.preventDefault();
            stop(true, true);
            $(".singleProduct").animate({opacity: "0"}, 500, function(){
                $(".singleProduct").removeClass("show");
            });
            $("body").removeClass("overflow")
        })
     }
    function fetchPublisher(id){
        for(let publisher of publishers){
            if(id == publisher.id) return publisher.name
        }
    }
     function freeShippingSingleProduct(data){
         if(data) return `<p><i class="fa fa-truck mr-2" aria-hidden="true"></i>Free shipping</p>`
         else return ''
     }
     function priceSingleProduct(prices){
         if(prices.old) return `<del class="oldPrice">$${prices.old}</del>
         <p>Current price: <span class="currentPrice">$${prices.new}</span></p>`
         else return `<p><span class="currentPrice">$${prices.new}</span><p>`
     }
     function specialOfferSingleProduct(data){
         if(data) return `<p class="specialOfferSingleProduct text-center">special</br>offer</p>`
         else return ''
     }



    

    

    


    




    //scroll to top function
    $(window).scroll(function (){
        if($(this).scrollTop() > 200){
            $("#scrollToTop").fadeIn();
        }
        else{
            $("#scrollToTop").fadeOut();
        }
    })

    $('#scrollToTop').click(function(){
        $('html').animate({scrollTop : 0}, 800);
      });

     $("#contactSubmit").hover(function(){
         $(this).css("background", "rgb(231, 231, 231)")
     }, function(){
        $(this).css("background", "#fff")
     })



     //provera podataka sa svakim unetim karakterom
    $("#name").keyup(()=>{
        if(!($(".sentMessage").hasClass("displayNone"))){$(".sentMessage").addClass("displayNone")}
        let name = $("#name");
        let regName = /^[A-Z][a-z]{2,15}(\s[A-Z][a-z]{2,25})+$/;
        let incorectName = $(".nameError");
        checkValue(name, regName, incorectName)
    })
    $("#email").keyup(()=>{
        if(!($(".sentMessage").hasClass("displayNone"))){$(".sentMessage").addClass("displayNone")}
        let email = $("#email");
        let regEmail = /^\w+(\.\w+)*\@[a-z]+(\.[a-z]+)*(\.[a-z]{2,3})$/;
        let incorectMail = $(".emailError");
        checkValue(email, regEmail, incorectMail)
    })
    $("#message").keyup(()=>{
        if(!($(".sentMessage").hasClass("displayNone"))){$(".sentMessage").addClass("displayNone")}
        let message = $("#message");
        let regMessage = /^[A-Z][\w\.\,\?\!\-\;\:\'\"]{5,30}(\s[\w\.\,\?\!\-\;\:\'\"]{1,20})*$/;
        let incorectMessage = $(".messageError");
        checkValue(message, regMessage, incorectMessage)
    })

    function checkValue(field, regEx, error){
        if(regEx.test(field.val())){
            if(!error.hasClass("displayNone")){
                error.addClass("displayNone")
            }
        }
        else{
            if(error.hasClass("displayNone")){
                error.removeClass("displayNone")
            }
        }
    }

    function checkField(value, regEx, error){
        if(regEx.test(value.val())){
            if(!error.hasClass("displayNone")){
                error.addClass("displayNone")
            }
            return true;
        }
        else{
            if(error.hasClass("displayNone")){
                error.removeClass("displayNone")
            }
            return false;
        }
    }

    //provera unetih podataka na dugme SEND
    $("#contactSubmit").click(()=>{
        if(!($(".sentMessage").hasClass("displayNone"))){$(".sentMessage").addClass("displayNone")}
       let name = $("#name");
       let email = $("#email");
       let message = $("#message");

       let regName = /^[A-Z][a-z]{2,15}(\s[A-Z][a-z]{2,25})+$/;
       let regEmail = /^\w+(\.\w+)*\@[a-z]+(\.[a-z]+)*(\.[a-z]{2,3})$/;
       let regMessage = /^[A-Z][\w\.\,\?\!\-\;\:\'\"]{5,30}(\s[\w\.\,\?\!\-\;\:\'\"]{1,20})*$/;

       let incorectName = $(".nameError");
       let incorectMail = $(".emailError");
       let incorectMessage = $(".messageError");

       if(!checkField(name, regName, incorectName)){
           return false
       }
       if(!checkField(email, regEmail, incorectMail)){
           return false
       }
       if(!checkField(message, regMessage, incorectMessage)){
        return false
        }   

        cleanTheFields();
        return true;

    })

    //provera klikom na taster submit
    function cleanTheFields(){
        $("#name").val("")
        $("#email").val("")
        $("#message").val("")
        $(".sentMessage").removeClass("displayNone")
    }


    $(".btnFilters").click(function(){
        if($(".filter").css("display")=='block'){
            $(this).html('Show filters <i class="fa fa-sliders" aria-hidden="true"></i>')
            $(".filter").hide("slow")
            $(".btnFilters > .fa-times").css("display", "none")
        }
        else{
            $(this).html('Hide filters <i class="fa fa-sliders" aria-hidden="true"></i>')
            $(".filter").show("slow");
            $(".btnFilters > .fa-times").css("display", "block")
        }
    })
    
}