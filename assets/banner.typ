#import "../src/lib.typ": *

#set page(width: 1280pt, margin: 0pt, height: auto)
#set text(size: 48pt, fill: white)

#rect(
  width: 100%,
  fill: gradient.linear(rgb(57, 140, 184), rgb(30, 179, 180)),
  radius: 24pt,
  inset: 32pt,
  {
    text(baseline: -6pt, weight: "bold")[use-tabler-icons]
    h(1fr)
    text(fill: gradient.linear(rgb(255, 255, 255, 0), white))[
      #tabler-icon("a-b")
      #tabler-icon("access-point")
      #tabler-icon("accessible")
      #tabler-icon("activity")
      #tabler-icon("address-book")
      #tabler-icon("affiliate")
      #tabler-icon("alarm")
      #tabler-icon("album")
      #tabler-icon("alert-circle")
      #tabler-icon("aperture")
    ]
  },
)
