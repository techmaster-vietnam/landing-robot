import "../css/style.css";
import "lazysizes";

//passive scroll Jquery
jQuery.event.special.touchstart = {
  setup: function (_, ns, handle) {
    this.addEventListener("touchstart", handle, {
      passive: !ns.includes("noPreventDefault"),
    });
  },
};
jQuery.event.special.touchmove = {
  setup: function (_, ns, handle) {
    this.addEventListener("touchmove", handle, {
      passive: !ns.includes("noPreventDefault"),
    });
  },
};
jQuery.event.special.wheel = {
  setup: function (_, ns, handle) {
    this.addEventListener("wheel", handle, { passive: true });
  },
};
jQuery.event.special.mousewheel = {
  setup: function (_, ns, handle) {
    this.addEventListener("mousewheel", handle, { passive: true });
  },
};

let bar = document.getElementById("bar");
let navbar = document.getElementById("nav-bar");
let closebar = document.getElementById("close-bar");
let body = document.querySelector("body");
let linklist = document.getElementById("link-list");

let flag = false;

bar.onclick = function () {
  navbar.style.width = "250px";
  bar.style.visibility = "hidden";
  body.style.overflowY = "hidden";
  linklist.style.display = "block";
};

closebar.onclick = function () {
  navbar.style.width = "0px";
  body.style.overflowY = "inherit";
  linklist.style.display = "none";
  setTimeout(function () {
    bar.style.visibility = "inherit";
  }, 200);
};

document.getElementById("btn-register").addEventListener(
  "click",
  (function (e) {
    const name = document.getElementById("name");
    const phone = document.getElementById("phone");
    const email = document.getElementById("email");
    const note = document.getElementById("note");
    const success = document.getElementById("success");
    const error = document.getElementById("error");
    const msg = document.getElementById("message");

    console.log("hello");

    function checkValid() {
      let valid = true;
      if (name.value.trim() == "") {
        name.classList.remove("is-valid");
        name.classList.add("is-invalid");

        valid = false;
      } else {
        name.classList.remove("is-invalid");
        name.classList.add("is-valid");
      }

      if (phone.value.trim() == "") {
        phone.classList.remove("is-valid");
        phone.classList.add("is-invalid");

        valid = false;
      } else {
        phone.classList.remove("is-invalid");
        phone.classList.add("is-valid");
      }

      if (email.value.trim() == "") {
        email.classList.remove("is-valid");
        email.classList.add("is-invalid");

        valid = false;
      } else {
        email.classList.remove("is-invalid");
        email.classList.add("is-valid");
      }

      return valid;
    }

    return function (e) {
      e.preventDefault();
      e.stopPropagation();

      if (checkValid()) {
        const btn = $(this);

        let nameVal = name.value;
        let phoneVal = phone.value;
        let emailVal = email.value;
        let noteVal = note.value;

        let req = {
          FullName: nameVal,
          Email: emailVal,
          Phone: phoneVal,
          Info: noteVal,
          Link: window.location.href,
          ItemId: "g3t",
          Type: 1,
        };

        let myJSON = JSON.stringify(req);

        $.ajax({
          url: "https://techmaster.vn/submit-advisory",
          type: "POST",
          contentType: "application/json; charset=utf-8",
          data: myJSON,
          dataType: "json",
          success: function (data) {
            name.value = phone.value = email.value = note.value = "";
            name.classList.remove("is-valid");
            phone.classList.remove("is-valid");
            email.classList.remove("is-valid");
            success.style.display = "inline-block";
            error.style.display = "none";
          },
          error: function (result) {
            success.style.display = "none";
            error.style.display = "inline-block";
            msg.innerText = result.responseJSON.message;
          },
        });

        btn.attr("disabled", false);
      }
    };
  })()
);

let isMaterialVideoLoaded = false;
/* Lazyload video */
$(window).on("scroll", function () {
  if (!isMaterialVideoLoaded) {
    var hT = $("#target").offset().top,
      hH = $("#target").outerHeight(),
      wH = $(window).height(),
      wS = $(this).scrollTop();
    if (wS > hT + hH - wH) {
      $(".material .intro_image").html(`
      <iframe width="560" height="315" class="lazyload" data-src="https://www.youtube.com/embed/1oJu87Fw2Pg"
      title="YouTube video player" frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen></iframe>
      `);
      isMaterialVideoLoaded = true;
    }
  }
});

let isDemoVideoLoaded = false;
/* Lazyload video */
$(window).on("scroll", function () {
  if (!isDemoVideoLoaded) {
    var hT = $("#product").offset().top,
      hH = $("#product").outerHeight(),
      wH = $(window).height(),
      wS = $(this).scrollTop();
    if (wS > hT + hH - wH) {
      $(".video_container").html(`
      <div class="video">
        <iframe width="560" height="315" src="https://www.youtube.com/embed/1oJu87Fw2Pg"
          title="YouTube video player" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
        <a href="https://www.youtube.com/watch?v=1oJu87Fw2Pg">
            <div class="video_name">
                HƯỚNG DẪN LẬP TRÌNH GAME TETRIS
            </div>
        </a>
        </div>
        <div class="video">
            <iframe width="560" height="315" src="https://www.youtube.com/embed/gVqWSkYjqeQ"
                title="YouTube video player" frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen></iframe>
            <a href="https://www.youtube.com/watch?v=gVqWSkYjqeQ">
                <div class="video_name">
                    HƯỚNG DẪN LẬP TRÌNH GAME FLAPPY BIRD
                </div>
            </a>
        </div>
      `);
      isDemoVideoLoaded = true;
    }
  }
});
