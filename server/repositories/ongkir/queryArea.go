package ongkirRepositories

import (
	"encoding/json"
	"log"
	"net/http"
	"server/utils"

	"github.com/gofiber/fiber/v2"
)

type ResArea struct {
	Label string `json:"label"`
	Id    string `json:"id"`
	Type  string `json:"type"`
}
type ResQuery struct {
	Status  string    `json:"status"`
	Data    []ResArea `json:"data"`
	Message string    `json:"message"`
}

type Query struct {
	Location string `query:"location"`
}

func QueryArea(c *fiber.Ctx) error {
	var err error
	var client = &http.Client{}
	var response ResQuery
	var query Query

	baseUrl := utils.GetENV("ONGKIR_HOST")

	if err := c.QueryParser(&query); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	req, err := http.NewRequest("GET", baseUrl+"/search?location="+query.Location, nil)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	res, err := client.Do(req)
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	defer res.Body.Close()

	if err = json.NewDecoder(res.Body).Decode(&response); err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	log.Println(res.StatusCode)

	return c.Status(res.StatusCode).JSON(response)
}
