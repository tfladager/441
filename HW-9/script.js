/*  ================================================
    FIRST BREATH — jQuery Motion Art
    Theme: Chaos to Calm / Ranch Calving
    Three systems: Images · Text · Shapes
    ================================================ */

$(document).ready(function () {

  /* ================================================
     IMAGE SYSTEM
     Ranch / nature images via Unsplash (free, no key)
     Each cycles through: chaos → labor → birth → calm
  ================================================ */
  const images = [
    // Stormy ranch sky — chaos
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=80",
    // Mother cow close-up — labor
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80",
    // Newborn calf on straw — birth
    "https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=800&q=80",
    // Calf standing in field — first steps
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=80",
    // Golden sunrise over pasture — calm
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80",
  ];

  const images2 = [
    // Straw / barn detail
    "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=80",
    // Ranch fence at dawn
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80",
    // Muddy boots — the work
    "https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=400&q=80",
    // Hay bales golden hour
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
  ];

  let imgIndex = 0;
  let img2Index = 0;

  // Preload first images
  $("#main-img").attr("src", images[imgIndex]);
  $("#secondary-img").attr("src", images2[img2Index]);

  function cycleMainImage() {
    var $frame = $("#img-frame");
    var $img   = $("#main-img");

    // Random starting position (stays near center with drift)
    var startLeft = Math.floor(Math.random() * 60) + 20; // 20–80% of viewport
    var startTop  = Math.floor(Math.random() * 40) + 30; // 30–70%

    $frame.css({
      left: startLeft + "%",
      top:  startTop  + "%",
      display: "block",
      opacity: 0
    });

    // Fade in, then drift, then fade out
    $frame.stop(true).fadeIn(1200, function () {
      $frame.animate(
        { left: (startLeft + (Math.random() * 8 - 4)) + "%",
          top:  (startTop  + (Math.random() * 6 - 3)) + "%" },
        { duration: 4000, easing: "swing",
          complete: function () {
            $frame.fadeOut(1200, function () {
              // Advance array
              imgIndex = (imgIndex + 1) % images.length;
              $img.attr("src", images[imgIndex]);
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

    var rightPos  = Math.floor(Math.random() * 20) + 3;
    var topPos    = Math.floor(Math.random() * 40) + 10;

    $frame.css({
      right: rightPos + "%",
      top:   topPos   + "%",
      display: "block",
      opacity: 0
    });

    $frame.stop(true).fadeIn(1800, function () {
      $frame.animate(
        { top: (topPos + (Math.random() * 6 - 3)) + "%" },
        { duration: 5000, easing: "swing",
          complete: function () {
            $frame.fadeOut(1500, function () {
              img2Index = (img2Index + 1) % images2.length;
              $img.attr("src", images2[img2Index]);
              setTimeout(cycleSecondaryImage, 1200);
            });
          }
        }
      );
    });
  }

  // Stagger the two image systems
  setTimeout(cycleMainImage, 300);
  setTimeout(cycleSecondaryImage, 2000);


  /* ================================================
     TEXT SYSTEM
     Quotes / phrases cycling through 8 dimensions
     of wellbeing — all filtered through ranch/calving
  ================================================ */
  const texts = [
    // Emotional
    "You don't always know what's about to come into the world. You wait. You breathe.",
    // Social
    "No rancher pulls a calf alone. Someone holds the lantern.",
    // Physical
    "Your hands know what to do. They've done this before. Trust them.",
    // Intellectual
    "Every birth teaches something the books didn't cover.",
    // Spiritual
    "There is a moment — still, quiet — when it breathes for the first time.",
    // Occupational
    "This is the work. Cold hands, early hours, and something that lives because you stayed.",
    // Environmental
    "The mud, the straw, the frozen air — this is where life insists on arriving.",
    // Financial
    "You don't count the cost while you're in the barn. That comes later. Right now, you just help.",
  ];

  const dimensions = [
    "Emotional",
    "Social",
    "Physical",
    "Intellectual",
    "Spiritual",
    "Occupational",
    "Environmental",
    "Financial",
  ];

  let textIndex = 0;

  function showText() {
    var $p   = $("#main-text");
    var $dim = $("#dim-name");

    // Choose base positions that drift slightly
    var baseBottom = Math.floor(Math.random() * 10) + 18;

    $("#text-display").css("bottom", baseBottom + "%");

    $p.text(texts[textIndex]);
    $dim.text(dimensions[textIndex]);

    // Fade in text and dim label
    $p.stop(true).css({ display: "block", opacity: 0 })
      .animate({ opacity: 1 }, 1000);

    $dim.stop(true).css({ opacity: 0 })
      .animate({ opacity: 0.85 }, 1200);

    // Drift text display slightly
    $("#text-display").animate(
      { bottom: (baseBottom + 2) + "%" },
      { duration: 4500, easing: "swing" }
    );

    // After display time, fade out and advance
    setTimeout(function () {
      $p.animate({ opacity: 0 }, 800, function () {
        $dim.animate({ opacity: 0 }, 400);
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(showText, 600);
      });
    }, 4000);
  }

  // Start text system after a beat
  setTimeout(showText, 1000);


  /* ================================================
     SHAPE SYSTEM
     Three shapes cycle through styles representing
     the emotional arc: stormy → tender → peaceful
  ================================================ */

  // Shape A — large glowing orb (the dawn / the breath)
  const shapeAStyles = [
    // Chaos: hot red-orange, large, blurry
    { background: "radial-gradient(circle, #c04a20 0%, transparent 70%)",
      width: "220px", height: "220px", borderRadius: "50%",
      filter: "blur(4px)", top: "8%", left: "3%" },
    // Transition: amber-straw
    { background: "radial-gradient(circle, #c9a96e 0%, transparent 70%)",
      width: "170px", height: "170px", borderRadius: "50%",
      filter: "blur(2px)", top: "12%", left: "8%" },
    // Calm: soft sage green
    { background: "radial-gradient(circle, #7a8c6e 0%, transparent 70%)",
      width: "130px", height: "130px", borderRadius: "50%",
      filter: "blur(1px)", top: "10%", left: "6%" },
  ];

  // Shape B — grounded circle (the earth, the barn floor)
  const shapeBStyles = [
    { background: "#3b2a1a", width: "140px", height: "80px",
      borderRadius: "50%", bottom: "18%", right: "6%",
      boxShadow: "0 0 30px rgba(60,20,0,0.6)" },
    { background: "#5c3d20", width: "110px", height: "110px",
      borderRadius: "50%", bottom: "16%", right: "9%",
      boxShadow: "0 0 20px rgba(90,60,20,0.5)" },
    { background: "#a8b89a", width: "90px", height: "90px",
      borderRadius: "50%", bottom: "14%", right: "12%",
      boxShadow: "0 0 15px rgba(160,185,150,0.4)" },
  ];

  // Shape C — triangle (chaos spike → softens to nothing)
  const shapeCStyles = [
    // Sharp jagged — chaos
    { borderLeft: "60px solid transparent", borderRight: "60px solid transparent",
      borderBottom: "104px solid #8b3a1a",
      left: "10%", bottom: "28%", filter: "blur(0px)" },
    // Smaller — calming
    { borderLeft: "40px solid transparent", borderRight: "40px solid transparent",
      borderBottom: "70px solid #c9a96e",
      left: "13%", bottom: "25%", filter: "blur(1px)" },
    // Nearly dissolved — peace
    { borderLeft: "25px solid transparent", borderRight: "25px solid transparent",
      borderBottom: "44px solid #7a8c6e",
      left: "15%", bottom: "22%", filter: "blur(2px)" },
  ];

  let shapeIndex = 0;

  function cycleShapes() {
    var styleA = shapeAStyles[shapeIndex % shapeAStyles.length];
    var styleB = shapeBStyles[shapeIndex % shapeBStyles.length];
    var styleC = shapeCStyles[shapeIndex % shapeCStyles.length];

    // Shape A — fade, restyle, move, fade in
    $("#shape-a").stop(true).animate({ opacity: 0 }, 700, function () {
      $("#shape-a").css(styleA).css({ opacity: 0 });
      $("#shape-a").animate({ opacity: 0.75 }, 1000);
      // Gentle float movement
      $("#shape-a").animate(
        { top: (parseInt(styleA.top) + 3) + "%" },
        { duration: 3500, easing: "swing" }
      );
    });

    // Shape B — fade, restyle, move, fade in
    $("#shape-b").stop(true).animate({ opacity: 0 }, 600, function () {
      // For shape B, use css properties that work (not position shorthands as css() directly)
      $("#shape-b").css({
        background: styleB.background,
        width: styleB.width,
        height: styleB.height,
        borderRadius: styleB.borderRadius,
        boxShadow: styleB.boxShadow,
        opacity: 0,
        bottom: styleB.bottom,
        right: styleB.right
      });
      $("#shape-b").animate({ opacity: 0.7 }, 1000);
      $("#shape-b").animate(
        { bottom: (parseInt(styleB.bottom) + 4) + "%" },
        { duration: 4000, easing: "swing" }
      );
    });

    // Shape C (triangle) — fade, restyle
    $("#shape-c").stop(true).animate({ opacity: 0 }, 500, function () {
      $("#shape-c").css({
        borderLeft: styleC.borderLeft,
        borderRight: styleC.borderRight,
        borderBottom: styleC.borderBottom,
        left: styleC.left,
        bottom: styleC.bottom,
        filter: styleC.filter,
        background: "transparent",
        width: 0,
        height: 0,
        borderRadius: 0,
        opacity: 0
      });
      $("#shape-c").animate({ opacity: 0.65 }, 1000);
    });

    shapeIndex++;
    setTimeout(cycleShapes, 3500);
  }

  // Initial fade-in of shapes
  $("#shape-a").css(shapeAStyles[0]).animate({ opacity: 0.7 }, 1500);
  $("#shape-b").css(shapeBStyles[0]).animate({ opacity: 0.6 }, 1800);
  $("#shape-c").css(shapeCStyles[0]).animate({ opacity: 0.55 }, 2000);

  setTimeout(cycleShapes, 4000);

});
