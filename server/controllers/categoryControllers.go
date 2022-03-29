package controllers

import (
	categoryRepositories "server/repositories/category"

	"github.com/gofiber/fiber/v2"
)

func CreateCategory(c *fiber.Ctx) error {
	return categoryRepositories.CreateCategory(c)
}

func GetAllCategory(c *fiber.Ctx) error {
	return categoryRepositories.GetAllCategory(c)
}

func GetDetailCategory(c *fiber.Ctx) error {
	return categoryRepositories.GetDetailCategory(c)
}

func UpdateCategory(c *fiber.Ctx) error {
	return categoryRepositories.UpdateCategory(c)
}

func DeleteCategory(c *fiber.Ctx) error {
	return categoryRepositories.DeleteCategory(c)
}
