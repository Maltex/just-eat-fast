module.exports =

  rootView:
    location: "just-eat#search"

  preloads: [
    {
      id: "restaurants"
      location: "just-eat#restaurants"
    }
    {
      id: "meals"
      location: "just-eat-fast#meals"
    }
  ]

  drawers:
    left:
      id: "leftDrawer"
      location: "common#drawer"
      showOnAppLoad: false
    options:
      animation: "swingingDoor"

  # tabs: [
  #   {
  #     title: "Just Eat"
  #     id: "just-eat"
  #     location: "just-eat#search"
  #   }
  #   {
  #     title: "Just Eat Fast!"
  #     id: "just-eat-fast"
  #     location: "just-eat-fast#search"
  #   }
  # ]
