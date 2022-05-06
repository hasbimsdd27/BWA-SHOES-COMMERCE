package ongkirRepositories

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"server/libs"
	"server/models"
	"server/utils"

	"github.com/gofiber/fiber/v2"
)

type PayloadOngkir struct {
	Destination     int    `json:"destination"`
	DestinationType string `json:"destination_type"`
	Weight          int    `json:"weight"`
}

type CourirerRes struct {
	Name        string `json:"nama"`
	Code        string `json:"kode_layanan"`
	ServiceName string `json:"nama_layanan"`
	Price       int    `json:"harga"`
	ETA         string `json:"ETA"`
}

type ResData struct {
	Courier []CourirerRes `json:"kurir"`
	From    string        `json:"dari"`
	To      string        `json:"ke"`
	Weight  string        `json:"berat"`
}

type ResBody struct {
	Status  string  `json:"status"`
	Message string  `json:"message"`
	Data    ResData `json:"data"`
}

func GetOngkir(c *fiber.Ctx) error {
	var payload PayloadOngkir
	var adminUser models.Users
	var response ResBody
	var err error

	db := libs.DB

	if err := c.BodyParser(&payload); err != nil {

		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	if payload.Destination == 0 || payload.DestinationType == "" || payload.Weight == 0 {
		return c.Status(400).JSON(fiber.Map{
			"status":  "error",
			"message": "please fill all required fields",
		})
	}

	if err = db.Preload("UserAddress").Where("role = ?", "ADMIN").First(&adminUser).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	baseUrl := utils.GetENV("ONGKIR_HOST")

	var jsonStr = []byte(fmt.Sprintf(`{"origin":%d,"origin_type":"%s","destination":%d,"destination_type":"%s","weight":%d,"courier":["jne","pos","sicepat","jnt", "wahana", "tiki"]}`, adminUser.UserAddress.AddressID,
		adminUser.UserAddress.AddressType, payload.Destination, payload.DestinationType, payload.Weight))

	req, err := http.NewRequest("POST", baseUrl+"/cost", bytes.NewBuffer(jsonStr))
	if err != nil {
		return c.Status(500).JSON(fiber.Map{
			"status":  "error",
			"message": err.Error(),
		})
	}

	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
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

	return c.Status(res.StatusCode).JSON(response)
}
