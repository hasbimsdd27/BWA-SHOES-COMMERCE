package routers

import (
	"server/controllers"

	"github.com/gofiber/fiber/v2"
)

func SetupRouter(app *fiber.App) {
	api := app.Group("/api")

	api.Get("/products", controllers.GetAllProducts)

	api.Get("/", controllers.HelloWorldController)
	api.Post("/category", controllers.CreateCategory)

}
