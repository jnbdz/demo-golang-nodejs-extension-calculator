package main

import "C"

//export Sum
func Sum(x, y float64) float64 {
	return x + y
}

func main() {}