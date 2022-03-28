package controllers

import (
	productRepositories "server/repositories/product"

	"github.com/gofiber/fiber/v2"
)

func GetAllProducts(c *fiber.Ctx) error {
	return productRepositories.AllProducts(c)
}

func CreateProduct(c *fiber.Ctx) error {
	return productRepositories.CreateProduct(c)
}

func GetDetailProduct(c *fiber.Ctx) error {
	return productRepositories.DetailProduct(c)
}
