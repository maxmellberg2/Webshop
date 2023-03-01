// ladda in alla varor
async function loadData() {

  return new Promise((resolve) => {
      fetch("./Omg.json", { mode: "no-cors" }).then((respone) => (
          respone.json()
      )).then((jsonFromFile) => {
          resolve(jsonFromFile);
      }).catch((error) => {
          console.log(error);
          resolve([]);
      });
  })

}

// ladda up alla produkter
async function displayProducts() {

  let output = "";
  // vänta på loadData har returnerat datan
  var data = await loadData();

  for (let item of data) {

      let stars = "";

      for (let i = 0; i < item.rating; i++) {
          stars += '<i class="fa-solid fa-star"></i>';
      }
      output += `
          <div class="pro">
              <img src="${item.image}" alt="Lol">
              <span>${item.brand}</span>
              <h5>${item.name}</h5>
              <div class="Stjarna">
                  ${stars}
              </div>
              <h4>${item.price} KR</h4>
              <div class="kort">            
              <button onclick="addToCart(${item.id})"><i class="fa-solid fa-credit-card cart"></i></button>
              </div>    
          </div>

          `;
  };

  document.querySelector('.products').innerHTML = output;
  document.querySelector('.products1').innerHTML = output;

}

function addToCart(productId) {
    alert("Varan har lagts till i Varukorgen")

  var items = localStorage.getItem("items");

  // om items inte är allokerat än
  if (items == null) {
      localStorage.setItem("items", JSON.stringify([{ id: productId, count: 1 }]));
      console.log(JSON.parse(localStorage.getItem("items")));
  }
  else {
      items = JSON.parse(items);

      var productIndex = -1;

      items.forEach((element, index) => {
          if (element.id == productId) {
              productIndex = index;

              return;
          }
      });

      if (productIndex == -1) {
          items.push({
              id: productId,
              count: 1
          });
          localStorage.setItem("items", JSON.stringify(items));
          console.log(items);
      } else {
          items[productIndex] = {
              id: productId,
              count: items[productIndex].count + 1,

          };
          localStorage.setItem("items", JSON.stringify(items));
          console.log(items);
      }

  }

}

// tarbort x antal varor från kundvagnen, om count =="all" tas hela varan bort
function removeFromCart(productId, count) {

  var tempitems = JSON.parse(localStorage.getItem("items"));
  var items = [];

  tempitems.forEach((element) => {

      if (element.id == productId) {

          if (count != "all") {
              element.count -= 1;

              if (element.count > 0)
                  items.push(element);
          }


      }
      else {
          items.push(element);
      }
  });

  localStorage.setItem("items", JSON.stringify(items));
  loadCartItems();
}
// ladda upp alla varor till kundvagnen
async function loadCartItems() {

  let output = "";
  var items = JSON.parse(localStorage.getItem("items"));

  // vänta på loadData har returnerat datan
  var data = await loadData();

  var totCost = 0;
  var shipping = 100;
  var moms = 0;
  var subCost = 0;

  if (items != null && data != null)
      items.forEach(element => {

          let stars = "";

          for (let i = 0; i < data[element.id].rating; i++) {
              stars += '<i class="fa-solid fa-star"></i>';
          }
          subCost += data[element.id].price * element.count;

          output += `
          <div class="product-cart-card">
              <img src="${data[element.id].image}" alt="Lol">
              <span>${data[element.id].brand}</span>
              <h5>${data[element.id].name}</h5>
              <div class="Stjarna">
                  ${stars}
              </div>
              <h4>${data[element.id].price} KR</h4>
              <h4>${element.count} st</h4>
              <button onclick="removeFromCart(${element.id}, 'all')">Ta Bort</button>
          </div>
          `;

      });

  moms = subCost * 0.2;
  totCost = moms + shipping + subCost;

  document.getElementById('cart').innerHTML = output;
  document.getElementById('moms').textContent = "Moms: " + moms + " kr";
  document.getElementById('shipping').textContent = "Frakt: " + shipping + " kr";
  document.getElementById('sub-tot').textContent = "Del total: " + subCost + "kr ";
  document.getElementById('tot-cost').textContent = "Total kostnad: " + totCost + " kr";
}
