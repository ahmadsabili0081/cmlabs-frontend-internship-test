$(document).ready(function () {
  $.ajax({
    url: 'https://www.themealdb.com/api/json/v1/1/categories.php',
    method: 'GET',
    success: function (response) {
      var categories = response.categories;
      categories.forEach((item) => {
        let { idCategory, strCategory, strCategoryThumb } = item
        let contentBaru = `<div class="box__foods">
                               <img src="${strCategoryThumb}" alt="">
                                <div class="box_opacity">
                                 <a class="listKategori" id="${strCategory}" href="categoryDetail.html">${strCategory}</a>
                                </div>
                           </div>`;
        $('.row__foods').append(contentBaru);
      });
      $('.listKategori').on('click', function (e) {
        let href = $(this).attr('id');
        saveToLocalStorage(href);
      });
    },
    error: function (error) {
      console.log(error);
    }
  });
  function saveToLocalStorage(data) {
    let kategori;
    if (localStorage.getItem('kategori') == null) {
      kategori = [];
    } else {
      kategori = JSON.parse(localStorage.getItem('kategori'));
      if (kategori != null) {
        kategori.splice(0);
        localStorage.setItem('kategori', JSON.stringify(kategori))
      }
    }
    kategori.push(data);
    localStorage.setItem('kategori', JSON.stringify(kategori));
  }
  function getLocalStorage() {
    let kategori;
    if (localStorage.getItem('kategori') == null) {
      kategori = [];
    } else {
      kategori = JSON.parse(localStorage.getItem('kategori'));
    }
    return kategori[0];
  }
  getLocalStorage();
  var kondisiPage = 0;
  var pageDitampilkan = 8;
  var totalItems = 0;
  $('.loadMore').click(function (e) {
    e.preventDefault();
    kondisiPage++;
    loadData();
  });
  function loadData() {
    $.ajax({
      url: `https://www.themealdb.com/api/json/v1/1/filter.php?c=${getLocalStorage()}`,
      method: 'GET',
      success: function (response) {
        let meals = response.meals;
        totalItems = meals.length;
        let MulaiIndex = kondisiPage * pageDitampilkan;
        let akhirIndex = MulaiIndex + pageDitampilkan;
        let tampilMeals = meals.slice(MulaiIndex, akhirIndex);
        $('.tabs_text').text(`${getLocalStorage()}`);
        $('.title_kategoriDetail').text(`${getLocalStorage()} Meals`);
        tampilMeals.forEach((item) => {
          let { strMealThumb, idMeal, strMeal } = item;
          let contentKategoriDetail = ` 
                                      <div class="box__kategoriDetail">
                                        <img src="${strMealThumb}" alt="">
                                        <div class="box_opacity_kategori_detail">
                                          <a class="detail" id="${idMeal}" href="Details.html">${strMeal}</a>
                                        </div>
                                      </div>`;
          $('.row__kategoriDetail').append(contentKategoriDetail);
        });
        $('.detail').on('click', function () {
          let href = $(this).attr('id');
          saveToLocalStorageDetail(href);
        });
        if (akhirIndex >= totalItems) {
          $('.loadMore').hide();
          $('.loadMore').css('display', 'none');
          if (totalItems > pageDitampilkan) {
            $('.lessMore').show();
            $('.lessMore').css('display', 'block');
          }
        }
      }
    });
  }
  loadData();
  $('.lessMore').on('click', function () {
    $('.row__kategoriDetail').html('');
    kondisiPage = 0;
    if (kondisiPage < totalItems) {
      $('.lessMore').hide();
      $('.lessMore').css('display', 'none');
    }
    $('.loadMore').show();
    $('.loadMore').css('display', 'block');
    loadData();

  });
  $('.hamburger').on('click', function () {
    $('nav').slideDown(500);
  });
  $('.closeNav').on('click', function () {
    $('nav').slideUp(500);
  });


  function saveToLocalStorageDetail(data) {
    let detail;
    if (localStorage.getItem('detail') == null) {
      detail = [];
    } else {
      detail = JSON.parse(localStorage.getItem('detail'));
      if (detail != null) {
        detail.splice(0);
        localStorage.setItem('detail', JSON.stringify(detail))
      }
    }
    detail.push(data);
    localStorage.setItem('detail', JSON.stringify(detail));
  }
  function getLocalStorageDetail() {
    let detail;
    if (localStorage.getItem('detail') == null) {
      detail = [];
    } else {
      detail = JSON.parse(localStorage.getItem('detail'));
    }
    return detail
  }
  getLocalStorageDetail();
  $.ajax({
    url: `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${getLocalStorageDetail()}`,
    method: 'GET',
    success: function (response) {
      let mealDetail = response.meals[0];
      let { strMeal, strYoutube, strInstructions, strMealThumb } = mealDetail;
      let ingredients = [];
      console.log(mealDetail);
      $('.tabs_text_1').text(`${getLocalStorage()}`);
      $('.tabs_text_2').text(`${strMeal}`);
      $('.title_detail').text(`${strMeal}`);
      for (let i = 1; i < 20; i++) {
        if (mealDetail['strIngredient' + i]) {
          ingredients.push(`${mealDetail['strMeasure' + i]} / ${mealDetail['strIngredient' + i]}`);
        }
      }
      let contentDetail = `<div class="box__detail">
                           <img src="${strMealThumb}" />
                           </div>
                          <div class="box__detail">
                          <h1>Intructions</h1>
                          <p>${strInstructions}</p>
                          <div class="resep">
                          <h1>Ingredients : </h1>
                          <ul>
                            ${ingredients.map(result => `<li>${result}</li>`).join('')}
                          </ul>
                          </div>
                          </div>
                          `;
      let contentTutorial = `<div class="youtube">
                               <img src="${strMealThumb}" />
                               <a target="blank_" class="tutorialClick" href="${strYoutube}"><i class="fa-brands fa-youtube" style="color: #f41010;"></i></a>
                            </div>
                              `;
      $('.row_detail').append(contentDetail);
      $('.row_detail_tutorial').append(contentTutorial);
    }
  });
  let header = document.querySelector('header');
  let buttonTop = document.querySelector('.buttonTop');
  window.addEventListener('scroll', (e) => {
    header.classList.toggle('sticky', scrollY > 50);
    buttonTop.classList.toggle('show', scrollY > 70);
  });
  buttonTop.addEventListener('click', () => {
    document.documentElement.scrollTop = 0;
  });
});

