package models

import (
	"time"

	"gorm.io/gorm"
)

type ProductGaleries struct {
	ID        uint     `json:"id" gorm:"primary_key;autoIncrement"`
	ProductId int      `json:"product_id"`
	Url       string   `json:"url"`
	Product   Products `gorm:"foreignKey:ProductId"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt
}
