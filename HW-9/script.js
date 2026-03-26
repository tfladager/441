/*  ================================================
    FIRST BREATH — jQuery Motion Art
    Theme: Chaos to Calm / Ranch Calving
    Three systems: Images · Text · Shapes
    ================================================ */

$(document).ready(function () {

  /* ================================================
     IMAGE SYSTEM
     Using reliable public domain images
     Arc: stormy sky → cattle → calf → calm pasture
  ================================================ */
  // Your actual ranch photos — stored in /imgs folder
  const images = [
    "imgs/ranch1.png",  // Mama & babies, mountains behind
    "imgs/ranch2.png",  // New calf spotted from the pickup
    "imgs/ranch3.png",  // Working the herd in the pasture
    "imgs/ranch5.png",  // Calf wrapped in John Deere blanket
    "imgs/ranch6.png",  // You with the calf — the calm
  ];

  const images2 = [
    "imgs/ranch4.png",  // House dog on the scene
    "imgs/ranch5.png",  // Calf in blanket — detail shot
    "imgs/ranch2.png",  // Calf from pickup door
    "imgs/ranch1.png",  // Ranch overview
  ];

  // No fallback needed — these are local files
  const imagesFallback = images;
  const images2Fallback = images2;

  let imgIndex = 0;
  let img2Index = 0;

  // Load with fallback: try Wikimedia, fall back to Picsum on error
  function loadImg($el, primary, fallback) {
    $el.attr("src", primary);
    $el.off("error").on("error", function () {
      $(this).off("error").attr("src", fallback);
    });
  }

  loadImg($("#main-img"),      images[0],        imagesFallback[0]);
  loadImg($("#secondary-img"), images2[0],       images2Fallback[0]);

  function cycleMainImage() {
    var $frame = $("#img-frame");
    var $img   = $("#main-img");

    var startLeft = Math.floor(Math.random() * 40) + 25;
    var startTop  = Math.floor(Math.random() * 30) + 30;

    $frame.css({ left: startLeft + "%", top: startTop + "%", display: "block", opacity: 0 });

    $frame.stop(true).fadeIn(1400, function () {
      $frame.animate(
        { left: (startLeft + (Math.random() * 6 - 3)) + "%",
          top:  (startTop  + (Math.random() * 5 - 2.5)) + "%" },
        { duration: 4500, easing: "swing",
          complete: function () {
            $frame.fadeOut(1400, function () {
              imgIndex = (imgIndex + 1) % images.length;
              loadImg($img, images[imgIndex], imagesFallback[imgIndex]);
              setTimeout(cycleMainImage, 600);
            });
          }
        }
      );
    });
  }

  function cycleSecondaryImage() {
    var $frame = $("#img-frame-2");
    var $img   = $("#secondary-img");

    var rightPos = Math.floor(Math.random() * 15) + 3;
    var topPos   = Math.floor(Math.random() * 35) + 12;

    $frame.css({ right: rightPos + "%", top: topPos + "%", display: "block", opacity: 0 });

    $frame.stop(true).fadeIn(1800, function () {
      $frame.animate(
        { top: (topPos + (Math.random() * 5 - 2.5)) + "%" },
        { duration: 5500, easing: "swing",
          complete: function () {
            $frame.fadeOut(1500, function () {
              img2Index = (img2Index + 1) % images2.length;
              loadImg($img, images2[img2Index], images2Fallback[img2Index]);
              setTimeout(cycleSecondaryImage, 1000);
            });
          }
        }
      );
    });
  }

  setTimeout(cycleMainImage, 400);
  setTimeout(cycleSecondaryImage, 2200);


  /* ================================================
     TEXT SYSTEM
     8 phrases — one per wellbeing dimension
     All filtered through the calving/ranch lens
  ================================================ */
  const texts = [
    "You don't always know what's about to come into the world. You wait. You breathe.",
    "No rancher pulls a calf alone. Someone holds the lantern.",
    "Your hands know what to do. They've done this before. Trust them.",
    "Every birth teaches something the books didn't cover.",
    "There is a moment — still, quiet — when it breathes for the first time.",
    "This is the work. Cold hands, early hours, and something that lives because you stayed.",
    "The mud, the straw, the frozen air — this is where life insists on arriving.",
    "You don't count the cost while you're in the barn. That comes later. Right now, you just help.",
  ];

  const dimensions = [
    "Emotional", "Social", "Physical", "Intellectual",
    "Spiritual", "Occupational", "Environmental", "Financial",
  ];

  let textIndex = 0;

  function showText() {
    var $p   = $("#main-text");
    var $dim = $("#dim-name");
    var baseBottom = Math.floor(Math.random() * 10) + 18;

    $("#text-display").css("bottom", baseBottom + "%");
    $p.text(texts[textIndex]);
    $dim.text(dimensions[textIndex]);

    $p.stop(true).css({ display: "block", opacity: 0 }).animate({ opacity: 1 }, 1000);
    $dim.stop(true).css({ opacity: 0 }).animate({ opacity: 0.85 }, 1200);

    $("#text-display").animate(
      { bottom: (baseBottom + 2) + "%" },
      { duration: 4500, easing: "swing" }
    );

    setTimeout(function () {
      $p.animate({ opacity: 0 }, 800, function () {
        $dim.animate({ opacity: 0 }, 400);
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(showText, 600);
      });
    }, 4000);
  }

  setTimeout(showText, 1000);


  /* ================================================
     SHAPE SYSTEM
     Three shapes cycling chaos → tender → peaceful
  ================================================ */
  const shapeAStyles = [
    { background: "radial-gradient(circle, #c04a20 0%, transparent 70%)",
      width: "220px", height: "220px", borderRadius: "50%", filter: "blur(4px)", top: "8%", left: "3%" },
    { background: "radial-gradient(circle, #c9a96e 0%, transparent 70%)",
      width: "170px", height: "170px", borderRadius: "50%", filter: "blur(2px)", top: "12%", left: "8%" },
    { background: "radial-gradient(circle, #7a8c6e 0%, transparent 70%)",
      width: "130px", height: "130px", borderRadius: "50%", filter: "blur(1px)", top: "10%", left: "6%" },
  ];

  const shapeBStyles = [
    { background: "#3b2a1a", width: "140px", height: "80px",  borderRadius: "50%", bottom: "18%", right: "6%",  boxShadow: "0 0 30px rgba(60,20,0,0.6)" },
    { background: "#5c3d20", width: "110px", height: "110px", borderRadius: "50%", bottom: "16%", right: "9%",  boxShadow: "0 0 20px rgba(90,60,20,0.5)" },
    { background: "#a8b89a", width: "90px",  height: "90px",  borderRadius: "50%", bottom: "14%", right: "12%", boxShadow: "0 0 15px rgba(160,185,150,0.4)" },
  ];

  const shapeCStyles = [
    { borderLeft: "60px solid transparent", borderRight: "60px solid transparent", borderBottom: "104px solid #8b3a1a", left: "10%", bottom: "28%", filter: "blur(0px)" },
    { borderLeft: "40px solid transparent", borderRight: "40px solid transparent", borderBottom: "70px solid #c9a96e",  left: "13%", bottom: "25%", filter: "blur(1px)" },
    { borderLeft: "25px solid transparent", borderRight: "25px solid transparent", borderBottom: "44px solid #7a8c6e",  left: "15%", bottom: "22%", filter: "blur(2px)" },
  ];

  let shapeIndex = 0;

  function cycleShapes() {
    var styleA = shapeAStyles[shapeIndex % shapeAStyles.length];
    var styleB = shapeBStyles[shapeIndex % shapeBStyles.length];
    var styleC = shapeCStyles[shapeIndex % shapeCStyles.length];

    $("#shape-a").stop(true).animate({ opacity: 0 }, 700, function () {
      $("#shape-a").css(styleA).css({ opacity: 0 }).animate({ opacity: 0.75 }, 1000);
      $("#shape-a").animate({ top: (parseInt(styleA.top) + 3) + "%" }, { duration: 3500, easing: "swing" });
    });

    $("#shape-b").stop(true).animate({ opacity: 0 }, 600, function () {
      $("#shape-b").css({ background: styleB.background, width: styleB.width, height: styleB.height,
        borderRadius: styleB.borderRadius, boxShadow: styleB.boxShadow,
        opacity: 0, bottom: styleB.bottom, right: styleB.right });
      $("#shape-b").animate({ opacity: 0.7 }, 1000);
      $("#shape-b").animate({ bottom: (parseInt(styleB.bottom) + 4) + "%" }, { duration: 4000, easing: "swing" });
    });

    $("#shape-c").stop(true).animate({ opacity: 0 }, 500, function () {
      $("#shape-c").css({ borderLeft: styleC.borderLeft, borderRight: styleC.borderRight,
        borderBottom: styleC.borderBottom, left: styleC.left, bottom: styleC.bottom,
        filter: styleC.filter, background: "transparent", width: 0, height: 0, borderRadius: 0, opacity: 0 });
      $("#shape-c").animate({ opacity: 0.65 }, 1000);
    });

    shapeIndex++;
    setTimeout(cycleShapes, 3500);
  }

  $("#shape-a").css(shapeAStyles[0]).animate({ opacity: 0.7 }, 1500);
  $("#shape-b").css(shapeBStyles[0]).animate({ opacity: 0.6 }, 1800);
  $("#shape-c").css(shapeCStyles[0]).animate({ opacity: 0.55 }, 2000);
  setTimeout(cycleShapes, 4000);

});
