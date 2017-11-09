package main

import "C"

//export Sum
func Sum(x, y float64) float64 {
	return x + y
}

//export Subtract
func Subtract(x, y float64) float64 {
	return x - y
}

//export Multiply
func Multiply(x, y float64) float64 {
	return x * y
}

//export Divide
func Divide(x, y float64) float64 {
	return x / y
}

func main() {}