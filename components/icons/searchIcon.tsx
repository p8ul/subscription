import * as React from "react"
import Svg, { Path } from "react-native-svg"
const SearchIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      fill="#52555A"
      d="M9.583 17.5a7.917 7.917 0 1 0 0-15.833 7.917 7.917 0 0 0 0 15.833ZM17.75 18.333a.58.58 0 0 1-.408-.166l-1.55-1.55a.589.589 0 0 1 0-.825.589.589 0 0 1 .825 0l1.55 1.55a.589.589 0 0 1 0 .825.616.616 0 0 1-.417.166Z"
    />
  </Svg>
)
export default SearchIcon 
