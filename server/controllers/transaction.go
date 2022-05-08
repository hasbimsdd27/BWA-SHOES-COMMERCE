package controllers

import (
	transactionRepositories "server/repositories/transaction"

	"github.com/gofiber/fiber/v2"
)

func CreateTransaction(c *fiber.Ctx) error {
	return transactionRepositories.CreateTransaction(c)
}
