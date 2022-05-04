package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Transactions struct {
	ID            uuid.UUID `gorm:"type:VARCHAR(255);primary_key" json:"id"`
	UserId        int       `json:"user_id"`
	Address       string    `json:"address" gorm:"type:text"`
	TotalPrice    float32   `json:"total_price" gorm:"default:0"`
	ShippingPrice float32   `json:"shipping_price" gorm:"default:0"`
	Status        string    `json:"status" gorm:"default:PENDING"`
	Payment       string    `json:"payment" gorm:"default:MANUAL"`

	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `json:"-"`
}
