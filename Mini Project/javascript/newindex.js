$(document).ready(function(){
  var valwishlist=0;
  var valcart=0;
  var data;
  
  $.ajax({
    url : "../index.json",
    success:function(result)
    {
      render(result);
      filterBy(result);
      filterPrice(result);
    }
  })

  /* for rendering */

  function render(data)
   {
          for(let i=0;i<data.length;i++)
          {
              /*for stars */
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
              var brand=data[i].brand;
              var price=data[i].price;
              var display=data[i].display;
              var storage=data[i].storage;
              var frontCamera=data[i].front_camera;
              var rearCamera=data[i].rear_camera;
              var battery=data[i].battery;
              var mobiletile = `
              <div class="tile tile${data[i].id}" tabindex="0">
                <img src="${data[i].path}" alt="${data[i].name}" class="fig">
                <div class="heart-border"><i class="fa-regular fa-heart fa-sm"></i></div>
                ${newSaleValue}
                <div class="cart-gallery">
                  <button type=button class="addCart ac">ADD TO CART</button>
                  <button type=button class="addCart dark-purple">VIEW GALLERY</button>
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
              $(".tile" + ids + " " + ".ac").click(function()
              {
                valcart=valcart+1;
                $(".cartvalue").text(valcart);
              })


              /*for compare function */
              var compareArray=[];
              $(".compare"+ids).click(function(){
                if(compareArray.includes(data[i].id)) {
                  alert("already added to compare");  
                }
                else
                 {
                  if(compareArray.length>=4) 
                  {
                    alert("only four products can be comapare at a time")
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

              $(".comparsion").hide();
              $(".compare-btn").click(function(){
                window.location.href = "#";
                $(".filter-products,.compare-popup").hide();
                $(".comparsion").show();
                for(let j=0;j<compareArray.length;j++)
                {
                  if(compareArray[j]==data[i].id)
                  {
                    var comapreDetailsTable=`
                    <div class="comparsion-table-data">
                      <span>${data[i].brand}</span>
                      <span>$${data[i].price}</span>
                      <span>${data[i].display}</span>
                      <span>${data[i].storage}</span>
                      <span>${data[i].battery}</span>
                      <span>${data[i].front_camera}</span>
                      <span>${data[i].rear_camera}</span>
                  </div>
                    `
                    $(".comparsion").append(comapreDetailsTable);
                  }
                }
              })

              $(".fa-circle-xmark").click(function(){
                // compareArray=[]
                $(".comparsion-table-data").remove();
                $(".filter-products,.compare-popup").show();
                $(".comparsion").hide();
              })
              
          }

          /*compare validations 
          $(".comparsion").hide();
          $(".compare-btn").click(function(){
            if(compareArray.length<2) 
            {
              alert("please add one more item to compare");
            }
            else 
            {
              window.location.href = "#";
              $(".filter-products,.compare-popup").hide();
              $(".comparsion").show();
            }
           })

          /*sorrting function calling */
          sortBy(data);
           
          /*for result  */
          $(".result").text("Showing "+data.length+" of "+"24 results");
          $(".resultsfound").text("Showing "+data.length+" of "+"24 results");
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

    $(".sortby-filters").hide(); /*for mobile */ /*match media */
    $(".filterby-filters ").hide()
    
    $(".sorts").click(function(){
      $(".sortby-filters").toggle();
    }) 
    $(".filters").click(function(){
      $(".filterby-filters").toggle();
    })

    /*brand-list hiding & showing*/
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
      
  /*for filtering by brand*/

  function filterBy(data)
  {
    var checkboxclick=[];
    $('input[type=checkbox]').each(function ()
    {
        $(this,".brand-list-item").click(function()
        { 
          if(checkboxclick.includes($(this).val())) //for checking
          {
            checkboxclick.splice(checkboxclick.indexOf($(this).val()),1);
          }
          else 
          {
            checkboxclick.push($(this).val());
          }
          var displayarray=[]; //comparing
          for(let i=0;i<data.length;i++)
          {
            if(checkboxclick.includes(data[i].brand))
            {
              displayarray.push(data[i]);
            }
          }
          $(".tile").remove();
          if(checkboxclick.length==0) 
          {
            render(data);
          }
          else{
            render(displayarray);

          }
        })
    })

  }
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

  // CLEARING ALL THE FILTERS
    $('.clear').click(function() 
    {
      $('input[type=checkbox]').each(function() {
        if($(this).is(':checked')) 
        {
            $(this).trigger('click');
        }
      })
     
    })


 //chat-support
 $(".chat-support").click(function()
 {
  let msg = prompt("enter you issue ");
  if ((msg == null) ) {
    msg = prompt("Please mention clearly");
  }
  else {
    alert("we will look into it");
  }
 })
 $("")
})

