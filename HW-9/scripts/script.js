/*  ================================================
    FIRST BREATH — jQuery Motion Art
    Theme: Chaos to Calm / Ranch Calving
    
    Three systems:
      1. Images  — fade, move, switch via array
      2. Text    — move, switch via array + timer
      3. Shapes  — move, switch via array + timer

    Eight Dimensions of Wellbeing — Ranch Edition
    ================================================ */

$(document).ready(function () {

  /* ================================================
     1. IMAGE SYSTEM
     Main frame + secondary frame, each cycling
     through an array of local ranch photos.
     Arc: mountains & mamas → new calf spotted →
          working the herd → calf in blanket → you & calf
  ================================================ */
  const images = [
    "images/ranch1.jpg",  // Mama & babies, mountains behind
    "images/ranch2.jpg",  // New calf spotted from the pickup
    "images/ranch3.jpg",  // Working the herd in the pasture
    "images/ranch5.jpg",  // Calf wrapped in John Deere blanket
    "images/ranch6.jpg",  // You with the calf — the calm
  ];

  const images2 = [
    "images/ranch4.jpg",  // House dog on the scene
    "images/ranch5.jpg",  // Calf in blanket — detail
    "images/ranch2.jpg",  // Calf from pickup door
    "images/ranch1.jpg",  // Ranch overview
  ];

  let imgIndex  = 0;
  let img2Index = 0;

  // Load first images
  $("#main-img").attr("src", images[0]);
  $("#secondary-img").attr("src", images2[0]);

  // Main image: fade in, drift, fade out, advance array
  function cycleMainImage() {
    var $frame = $("#img-frame");
    var $img   = $("#main-img");
    var sL = Math.floor(Math.random() * 40) + 25;
    var sT = Math.floor(Math.random() * 30) + 30;

    $frame.css({ left: sL + "%", top: sT + "%" });
    $frame.stop(true, true).animate({ opacity: 1 }, 1400, function () {
      $frame.animate(
        { left: (sL + (Math.random() * 6 - 3)) + "%",
          top:  (sT + (Math.random() * 5 - 2.5)) + "%" },
        { duration: 4500, easing: "swing",
          complete: function () {
            $frame.animate({ opacity: 0 }, 1400, function () {
              imgIndex = (imgIndex + 1) % images.length;
              $img.attr("src", images[imgIndex]);
              setTimeout(cycleMainImage, 600);
            });
          }
        }
      );
    });
  }

  // Secondary image: same pattern, different position + timing
  function cycleSecondaryImage() {
    var $frame = $("#img-frame-2");
    var $img   = $("#secondary-img");
    var rP = Math.floor(Math.random() * 15) + 3;
    var tP = Math.floor(Math.random() * 35) + 12;

    $frame.css({ right: rP + "%", top: tP + "%" });
    $frame.stop(true, true).animate({ opacity: 1 }, 1800, function () {
      $frame.animate(
        { top: (tP + (Math.random() * 5 - 2.5)) + "%" },
        { duration: 5500, easing: "swing",
          complete: function () {
            $frame.animate({ opacity: 0 }, 1500, function () {
              img2Index = (img2Index + 1) % images2.length;
              $img.attr("src", images2[img2Index]);
              setTimeout(cycleSecondaryImage, 1000);
            });
          }
        }
      );
    });
  }

  // Stagger start so both frames don't pop at once
  setTimeout(cycleMainImage, 500);
  setTimeout(cycleSecondaryImage, 2500);


  /* ================================================
     2. TEXT SYSTEM
     One phrase per wellbeing dimension, all written
     through the lens of calving and ranch life.
     Fades in, drifts upward, fades out, advances array.
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
    var bb   = Math.floor(Math.random() * 10) + 18;

    $("#text-display").css("bottom", bb + "%");
    $p.text(texts[textIndex]);
    $dim.text(dimensions[textIndex]);

    $p.stop(true, true).animate({ opacity: 1 }, 1000);
    $dim.stop(true, true).animate({ opacity: 0.85 }, 1200);
    $("#text-display").animate({ bottom: (bb + 2) + "%" }, { duration: 4500, easing: "swing" });

    // Hold for 4 seconds, then fade out and advance
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
     3. SHAPE SYSTEM
     Three shapes cycle through style arrays that
     mirror the chaos-to-calm arc:
       State 0: hot red/blurry     — chaos of birth
       State 1: warm amber/straw   — the transition
       State 2: soft sage green    — calm arrives
  ================================================ */

  // Shape A — large glowing orb (dawn light, first breath)
  const sAArr = [
    { background: "radial-gradient(circle, #c04a20 0%, transparent 70%)", width: "220px", height: "220px", borderRadius: "50%", filter: "blur(4px)", top: "8%",  left: "3%" },
    { background: "radial-gradient(circle, #c9a96e 0%, transparent 70%)", width: "170px", height: "170px", borderRadius: "50%", filter: "blur(2px)", top: "12%", left: "8%" },
    { background: "radial-gradient(circle, #7a8c6e 0%, transparent 70%)", width: "130px", height: "130px", borderRadius: "50%", filter: "blur(1px)", top: "10%", left: "6%" },
  ];

  // Shape B — grounded circle (earth, barn floor)
  const sBArr = [
    { background: "#3b2a1a", width: "140px", height: "80px",  borderRadius: "50%", bottom: "18%", right: "6%",  boxShadow: "0 0 30px rgba(60,20,0,0.6)" },
    { background: "#5c3d20", width: "110px", height: "110px", borderRadius: "50%", bottom: "16%", right: "9%",  boxShadow: "0 0 20px rgba(90,60,20,0.5)" },
    { background: "#a8b89a", width: "90px",  height: "90px",  borderRadius: "50%", bottom: "14%", right: "12%", boxShadow: "0 0 15px rgba(160,185,150,0.4)" },
  ];

  // Shape C — triangle (chaos spike that softens to peace)
  const sCArr = [
    { borderLeft: "60px solid transparent", borderRight: "60px solid transparent", borderBottom: "104px solid #8b3a1a", left: "10%", bottom: "28%" },
    { borderLeft: "40px solid transparent", borderRight: "40px solid transparent", borderBottom: "70px solid #c9a96e",  left: "13%", bottom: "25%" },
    { borderLeft: "25px solid transparent", borderRight: "25px solid transparent", borderBottom: "44px solid #7a8c6e",  left: "15%", bottom: "22%" },
  ];

  let si = 0;

  function cycleShapes() {
    var sA = sAArr[si % 3];
    var sB = sBArr[si % 3];
    var sC = sCArr[si % 3];

    // Shape A
    $("#shape-a").stop(true, true).animate({ opacity: 0 }, 700, function () {
      $("#shape-a").css(sA).animate({ opacity: 0.75 }, 1000);
      $("#shape-a").animate({ top: (parseInt(sA.top) + 3) + "%" }, { duration: 3500, easing: "swing" });
    });

    // Shape B
    $("#shape-b").stop(true, true).animate({ opacity: 0 }, 600, function () {
      $("#shape-b").css({ background: sB.background, width: sB.width, height: sB.height,
        borderRadius: sB.borderRadius, boxShadow: sB.boxShadow, bottom: sB.bottom, right: sB.right });
      $("#shape-b").animate({ opacity: 0.7 }, 1000);
      $("#shape-b").animate({ bottom: (parseInt(sB.bottom) + 4) + "%" }, { duration: 4000, easing: "swing" });
    });

    // Shape C (triangle)
    $("#shape-c").stop(true, true).animate({ opacity: 0 }, 500, function () {
      $("#shape-c").css({ borderLeft: sC.borderLeft, borderRight: sC.borderRight,
        borderBottom: sC.borderBottom, left: sC.left, bottom: sC.bottom,
        background: "transparent", width: 0, height: 0, borderRadius: 0 });
      $("#shape-c").animate({ opacity: 0.65 }, 1000);
    });

    si++;
    setTimeout(cycleShapes, 3500);
  }

  // Initial reveal
  $("#shape-a").css(sAArr[0]).animate({ opacity: 0.7 }, 1500);
  $("#shape-b").css(sBArr[0]).animate({ opacity: 0.6 }, 1800);
  $("#shape-c").css(sCArr[0]).animate({ opacity: 0.55 }, 2000);
  setTimeout(cycleShapes, 4000);

});
