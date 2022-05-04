package controllers

import (
	cartRepositories "server/repositories/cart"

	"github.com/gofiber/fiber/v2"
)

func CreateUpdateCart(c *fiber.Ctx) error {
	return cartRepositories.AddToCart(c)
}

func DeleteCart(c *fiber.Ctx) error {
	return cartRepositories.DeleteCart(c)
}

func GetCarts(c *fiber.Ctx) error {
	return cartRepositories.GetCarts(c)
}
