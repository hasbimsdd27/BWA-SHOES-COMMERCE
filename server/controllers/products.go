package controllers

import (
	productRepositories "server/repositories/product"

	"github.com/gofiber/fiber/v2"
)

func GetAllProducts(c *fiber.Ctx) error {
	return productRepositories.AllProducts(c)
}
