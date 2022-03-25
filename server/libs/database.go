package libs

import (
	"fmt"
	"log"
	"server/models"
	"server/utils"
	"strconv"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	var err error

	p := utils.GetENV("DB_PORT")

	port, err := strconv.ParseUint(p, 10, 32)

	if err != nil {
		log.Println("Port Parsing Failed")
	}

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		utils.GetENV("DB_USERNAME"), utils.GetENV("DB_PASSWORD"), utils.GetENV("DB_HOST"), port, utils.GetENV("DB_NAME"),
	)

	DB, err = gorm.Open(mysql.Open(dsn))

	if err != nil {
		fmt.Println(err.Error())
	}

	DB.AutoMigrate(
		&models.ProductCategories{},
		&models.Users{},
		&models.Products{},
		&models.ProductGaleries{},
		&models.Transactions{},
		&models.TransactionItems{},
	)

	fmt.Println("Connection opened to database")
}
