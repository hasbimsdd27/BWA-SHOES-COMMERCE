package models

import (
	"time"

	"gorm.io/gorm"
)

type Transactions struct {
	ID            uint    `json:"id" gorm:"primary_key;autoIncrement"`
	UserId        int     `json:"user_id"`
	Address       string  `json:"address" gorm:"type:text"`
	TotalPrice    float32 `json:"total_price" gorm:"default:0"`
	ShippingPrice float32 `json:"shipping_price" gorm:"default:0"`
	Status        string  `json:"status" gorm:"default:PENDING"`
	Payment       string  `json:"payment" gorm:"default:MANUAL"`

	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt
}
