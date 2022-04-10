package controllers

import (
	userRepositories "server/repositories/user"

	"github.com/gofiber/fiber/v2"
)

func Register(c *fiber.Ctx) error {
	return userRepositories.Register(c)
}

func Login(c *fiber.Ctx) error {
	return userRepositories.Login(c)
}

func LoginAdmin(c *fiber.Ctx) error {
	return userRepositories.LoginAdmin(c)
}
