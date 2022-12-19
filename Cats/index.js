const $wrapper = document.querySelector("[data-wrapper]");
const $addButton = document.querySelector("[data-add_button]");
const $modal = document.querySelector("[data-modal]");
const $spinner = document.querySelector("[data-spinner]");
const $closeButton = document.querySelector("[data-close_button]");
const $closeButtonShow = document.querySelector("[data-close_button_show]");
const $formModal = document.querySelector(".custom-modal");
const $infoModal = document.querySelector("[data-modal-show]");
const $error = document.getElementById("error");
const $modalShow = document.querySelector("[data-modal-info]");
const $name = document.querySelector(".cat__name");
const $age = document.getElementById("age");
const $disc = document.querySelector(".cat__disc");
const $rating = document.querySelector("#rate");
const $image = document.querySelector("#image");
const $like = document.querySelector(".like");
const $closeButtonEdit = document.querySelector("[data-close_button_edit]");
const $modalEdit = document.querySelector("[data-modal-edit]");
const $editModal = document.querySelector(".custom-modal-edit");


const api = new Api("ashvedov");

const gerenationCatCard = (
  cat
) => `<div data-card_id=${cat.id} class="card mx-2" style="width: 18rem;">
<img src="${cat.image}" class="card-img-top" alt="${cat.name}">
<div class="card-body">
  <h5 class="card-title">${cat.name}</h5>
  <button data-action="show" class="btn btn-primary">Show</button>
  <button data-action="delete" class="btn btn-danger">Delete</button>
  <button data-action="edit" class="btn btn-success">Edit</button>
</div>
</div>`;

$wrapper.addEventListener("click", (event) => {
  switch (event.target.dataset.action) {
    case "delete":
      const $currentCard = event.target.closest("[data-card_id]");
      const catId = $currentCard.dataset.card_id;
      api.delCat(catId);
      $currentCard.remove();
      break;

    case "show":
      //*onclick modal should be open (подробная информация о коте в новой модалке)
      const currentId = event.target.closest("[data-card_id]").dataset.card_id;
      $spinner.classList.remove("hidden");
      api
        .getCat(currentId)
        .then((res) => res.json())
        .then((data) => {
          $name.innerHTML = data.name;
          $age.innerHTML = data.age;
          $disc.innerHTML = data.description;
          $rating.innerHTML = data.rate;
          $image.src = data.image;
          data.favorite
            ? ($like.style.display = "block")
            : ($like.style.display = "none");
        });
      setTimeout(() => {
        $spinner.classList.add("hidden");
        $modalShow.classList.remove("hidden");
      }, 500);

      break;
    case "edit":
      const editedId = event.target.closest("[data-card_id]").dataset.card_id;
      $spinner.classList.remove("hidden");
      api
        .getCat(editedId)
        .then((res) => res.json())
        .then((data) => {
          document.forms.catsFormEdit.id.value = data.id;
          document.forms.catsFormEdit.name.value = data.name;
          document.forms.catsFormEdit.age.value = data.age;
          document.forms.catsFormEdit.description.value = data.description;
          document.forms.catsFormEdit.rate.value = data.rate;
          document.forms.catsFormEdit.image.value = data.image;
          data.favorite
            ? document.forms.catsFormEdit.favorite.setAttribute("checked", true)
            : false;
        });
      setTimeout(() => {
        $spinner.classList.add("hidden");
        $modalEdit.classList.remove("hidden");
      }, 500);

      break;

    default:
      break;
  }
});

document.forms.catsFormEdit.addEventListener("submit", (event) => {
  event.preventDefault();
  $error.innerHTML = "";

  const editedId = Number(document.forms.catsFormEdit.id.value);

  const data = Object.fromEntries(new FormData(event.target).entries());
  data.favorite = data.favorite === "on";

  api
    .updCat(data, editedId)
    .then((res) => (res.ok ? getAllCats() : res.json()))
    .then((err) => {
      return ($error.innerHTML = "Произошла ошибка: " + err.message);
    });
});

document.forms.catsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  $error.innerHTML = "";
  const data = Object.fromEntries(new FormData(event.target).entries());

  data.age = Number(data.age);
  data.id = Number(data.id);
  data.rate = Number(data.rate);
  data.favorite = data.favorite === "on";

  api
    .addCat(data)
    .then((res) => (res.ok ? getAllCats() : res.json()))
    .then((err) => {
      return ($error.innerHTML = "Произошла ошибка: " + err.message);
    });
});

$addButton.addEventListener("click", () => {
  $modal.classList.remove("hidden");
});

$closeButton.addEventListener("click", () => {
  $modal.classList.add("hidden");
  document.forms.catsForm.reset();
  $error.innerHTML = "";
});
$closeButtonShow.addEventListener("click", () => {
  $modalShow.classList.add("hidden");
});
$closeButtonEdit.addEventListener("click", () => {
  $modalEdit.classList.add("hidden");
});

document.addEventListener("click", function (e) {
  if ($formModal.contains(e.target) && e.target != $addButton) {
    return;
  } else if (!e.target.closest("[data-add_button]")) {
    $modal.classList.add("hidden");
  }

  if (
    $infoModal.contains(e.target) &&
    e.target != document.querySelector(".btn.btn-primary")
  ) {
    return;
  } else if (!e.target.closest(".btn.btn-primary")) {
    $modalShow.classList.add("hidden");
  }

  if (
    $editModal.contains(e.target) &&
    e.target != document.querySelector(".btn.btn-success")
  ) {
    return;
  } else if (!e.target.closest(".btn.btn-success")) {
    $modalEdit.classList.add("hidden");
  }
});

const getAllCats = async () => {
  $modal.classList.add("hidden");
  $modalEdit.classList.add("hidden");
  const responce = await api.getCats();
  const data = await responce.json();
  $wrapper.innerHTML = "";
  $spinner.classList.remove("hidden");
  setTimeout(() => {
    $spinner.classList.add("hidden");
    data.forEach((cat) => {
      $wrapper.insertAdjacentHTML("beforeend", gerenationCatCard(cat));
    });
  }, 2000);
};
getAllCats();
