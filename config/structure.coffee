module.exports =

  tabs: [
    {
      title: "Just Eat"
      id: "just-eat"
      location: "just-eat#search"
    }
    {
      title: "Just Eat"
      id: "just-eat-fast"
      location: "just-eat-fast#search"
    }
  ]

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

  # initialView:
  #   id: "initialView"
  #   location: "example#initial-view"
