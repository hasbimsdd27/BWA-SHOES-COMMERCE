package controllers

import (
	ongkirRepositories "server/repositories/ongkir"

	"github.com/gofiber/fiber/v2"
)

func QueryArea(c *fiber.Ctx) error {
	return ongkirRepositories.QueryArea(c)
}

func GetOngkir(c *fiber.Ctx) error {
	return ongkirRepositories.GetOngkir(c)
}
