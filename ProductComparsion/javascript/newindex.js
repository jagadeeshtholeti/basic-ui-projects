$(document).ready(function(){
  var valwishlist=0;
  var valcart=0;
  var searchKey;
  $.ajax({
    url : "../index.json",
    success:function(result)
    {
      render(result);
      filterPrice(result);
      /*for search */
      $(".fa-magnifying-glass").click(function()
      {
        $(".Products").empty();
        searchKey = $(".search-field").val();
        var res =  result.filter(function(i)
        {
          return i.brand == searchKey;
        });
        render(res);

      })  
    }
  })

  /* for rendering */

  function render(data)
   {
          for(let i=0;i<data.length;i++)
          {
              /*for rating stars */
              var rating=Math.floor(data[i].customer_ratings );
              var stars=''; 
              for(let i=0;i<5;i++)
              {
                if(rating>0){
                  rating--;
                  stars+=`<i class="fa fa-star fa-sm red"></i>`;
                  }
                  else{
                      stars+=`<i class="fa fa-star fa-sm"></i>`;
                  }
              }


              /*for new & sale */
              var newItems=data[i].new;
              var saleItems=data[i].sale;
              var newSaleValue='';
              if(newItems=='yes' && saleItems=='yes')
              {
                newSaleValue=`
                <div class='new-sale'>
                  <div class='new'>NEW</div>
                  <div class='sale'>SALE</div>
                </div>`;
              }
              else if(newItems=='yes' && saleItems=='no')
              {
                newSaleValue=`
                <div class='new-sale'>
                  <div class='new'>NEW</div>
                </div>`
              }
              else if(newItems=='no' && saleItems=='yes'){
                newSaleValue=`
                <div class='new-sale'>
                  <div class='sale'>SALE</div>
                </div>`
              }
              /*tile rendering */
              var mobiletile = `
              <div class="tile tile${data[i].id}" tabindex="0">
                <img src="${data[i].path}" alt="${data[i].name}" class="fig">
                <div class="heart-border"><i class="fa-regular fa-heart fa-sm"></i></div>
                ${newSaleValue}
                <div class="cart-gallery">
                  <button type=button class="addCart">ADD TO CART</button>
                </div>
                <div class=marketingDetails>
                    <h4 class="model">${data[i].name}</h4>
                    <div class="rating">
                        ${stars}
                        <span class="rating-count">${"("+data[i].total_rating+")"}</span>
                    </div>
                   <div class="pricing">
                      <span class="finalPrice">${"$"+data[i].price}</span>
                      <s class="MRP">${"$"+data[i].mrp}</s> 
                      <span class="discount">${data[i].discount}</span>
                    </div>  
                </div>
                <div>
                  <button type="button" class="add-to-compare compare${data[i].id}"><b>Add To Compare</b></button>
                </div>
              </div>`
              $(".Products").append(mobiletile);

  
              var ids=data[i].id;
              /*for wihslist */ 
              
              let select = ".tile" + ids + " " + ".fa-heart";
              $(select).click(function(){
                if($(this).hasClass("red"))
                {
                  valwishlist=valwishlist-1;
                  $(".wish").text(valwishlist);
                  $(this).removeClass("red");
                  $(this).removeClass("fa-solid").addClass("fa-regular");
                }
                else {
                  valwishlist++;
                  $(this).addClass("red");
                  $(".wish").text(valwishlist);
                  $(this).removeClass("fa-regular").addClass("fa-solid");
                }
              
              })

              /*for cart */
              $(".tile" + ids + " " + ".addCart").click(function()
              {
                valcart=valcart+1;
                $(".cart").text(valcart);
              })

              /*for compare pop up */
              var compareArray=[];
              $(".compare"+ids).click(function(){

                if(compareArray.includes(data[i].id)) {
                  alert("already added to compare");  
                }
                else
                 {
                  if(compareArray.length>=5) 
                  {
                    alert("only five products can be comapare at a time")
                  }
                  else 
                  {
                    compareArray.push(data[i].id)
                    $(".compare-popup").css("display","flex");
                    var compareProducts = $(`<div class="compare-products compare-products${data[i].id}">`)
                    var comapreDetails=`
                                  <img src="${data[i].path}" alt="${data[i].name}" class="compare-fig">
                                  <div>${data[i].name}</div>
                                  <span><i class="fa-solid fa-xmark fa-lg remove${data[i].id}"></i><span>`

                    compareProducts.append(comapreDetails) 
                    $(".compare-popup").append(compareProducts);

                    /*compare pop up producst removal */

                    $(".remove"+data[i].id).click(function()
                    {
                      $(".compare-products"+data[i].id).remove();
                      compareArray = $.grep(compareArray, function(value) {
                        return value != data[i].id;
                      });
  
                      if(compareArray.length==0)
                      {
                        $(".compare-popup").css("display","none");
                      }
                    })
                    
                  }
                 
                }
                
              })
              /*compre-tables */
              $(".comparsion-window").hide();
        
              $(".compare-btn").click(function(){

                window.location.href = "#";
                $(".filter-products,.compare-popup").hide();
                $(".comparsion-window").show();
                for(let j=0;j<compareArray.length;j++)
                {
                  if(compareArray[j]==data[i].id)
                  {
                    var comapreDetailsTable=`
                    <tr class="comparsion-table-data">
                      <td><b>${data[i].brand}</b></td>
                      <td>${data[i].name}</td>
                      <td><img src="${data[i].path}" alt="${data[i].name}" class="comparetable-fig"></td>
                      <td>$${data[i].price}</td>
                      <td>${data[i].display}</td>
                      <td>${data[i].storage}</td>
                      <td>${data[i].battery}</td>
                      <td>${data[i].front_camera}</td>
                      <td>${data[i].rear_camera}</td>
                   </tr>
                    `
                    $(".comparsion-table").append(comapreDetailsTable);
                  }
                }
              })
              /*compare table removal */
              $(".fa-circle-xmark").click(function(){
                $(".comparsion-table-data").remove();
                $(".filter-products,.compare-popup").show("slow");
               $(".comparsion-window").hide();
              })
              
          }
          
          
          /*sorrting function calling */
          sortBy(data);
           
          /*for result  */
          $(".result").text("Showing "+data.length+" of "+"24 results");
    }

  
  /*for sortings*/
  function sortBy(data)
  {
    var newArray = new Array();
    var saleArray = new Array();
    let sortedData;
    function sorting(key)
    {
        if(key=="ratings")
        {
          sortedData=data.sort(function(a,b)
          {
            return b.customer_ratings - a.customer_ratings;   // sorting by rating 
          })
        }
        else if(key=="pricing")
        {
          sortedData=data.sort(function(a,b)
          {
            return a.price - b.price;    // sorting by price
          })
        }
        

        else if(key=="newproducts") // checking and getting newest first
        {
          data.filter(function(i)
          {
            if (i.new == "yes") {
              newArray.push(i);
            }
            else {
              saleArray.push(i);
            }   
          })

          sortedData = newArray.concat(saleArray)
        }

        
        $(".Products").empty();
        render(sortedData);
      }
    
    $(".ratings").click(function() //for ratings click
    {
      $(".ratings").addClass("border-bottom");
      $(".price,.newest").removeClass("border-bottom");
      let key="ratings";
      sorting(key);
    })

    $(".price").click(function() //for sorty-by price click
    {
      $(".price").addClass("border-bottom");  
      $(".ratings,.newest").removeClass("border-bottom");
      let key="pricing";
      sorting(key);
    })

    $(".newest").click(function(){ // for neweest click
      $(".newest").addClass("border-bottom");
      $(".ratings,.price").removeClass("border-bottom");
      let key="newproducts";
      sorting(key);
    })

    
  };  
  
  /*************filter part*************** */

    /*price-list hiding & showing*/

    $(".brand-list").hide();
    $(".list").each(function(index) 
    {
        $(this).find("a").click(function(){
        $("#dropdown" + index).toggle();
        if($(this).find("i").hasClass("fa-chevron-down"))
        {
          $(this).find("i").removeClass("fa-chevron-down");
          $(this).find("i").addClass("fa-chevron-up");
        }
        else{
          $(this).find("i").removeClass("fa-chevron-up");
          $(this).find("i").addClass("fa-chevron-down");
        }
      })
    })  
      
  /*for filtering by price*/
  function filterPrice(data)
  {
    function Price()
    {
      let filterData='';
      var priceMin = $(".rangeinput-min").val();
      var priceMax = $(".rangeinput-max").val();
      $(".min-value").val(priceMin);
      $(".max-value").val(priceMax);
      filterData = data.filter(function(i)
      {
       return ((parseInt(priceMin) < parseInt(i.price)) && (parseInt(priceMax) > parseInt(i.price)) );    // checking and getting price
      })
      $(".Products").empty();
      render(filterData);
    }
    $(".rangeinput-min").change(function () 
    {  
      Price();
    })
    $(".rangeinput-max").change(function () {
      Price();
    })
  }


 /*home-page */
 /*for humburger-icon */
 $(".hamburger-menu").click(function()
 {
  $(".home-nav-bar").toggle();
 })
 var images=["home-banner.jpg","image2.jpg","image3.jpg"]
  var i = 0;
  $(".home-banner").css("background-image", "url(../images/" + images[i] + ")");
  setInterval(function () {
      i++;
      if (i == images.length) {
          i = 0;
      }
      $(".home-banner").fadeOut("slow", function () {
          $(this).css("background-image", "url(../images/" + images[i] + ")");
          $(this).fadeIn("slow");
      });
    }, 3000);
})

