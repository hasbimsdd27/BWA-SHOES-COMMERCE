package main

import (
	"log"
	"server/libs"
	"server/routers"
	"server/utils"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func main() {
	PORT := utils.GetENV("PORT")

	libs.ConnectDB()

	app := fiber.New()
	app.Use(logger.New())
	app.Use(cors.New())
	app.Static("/assets", "./assets")
	routers.SetupRouter(app)

	log.Fatal(app.Listen(":" + PORT))
}
