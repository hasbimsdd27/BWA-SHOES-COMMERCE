package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type TransactionItems struct {
	ID            uuid.UUID `gorm:"type:VARCHAR(255);primary_key" json:"id"`
	UserId        int       `json:"user_id"`
	ProductsId    int       `json:"product_id"`
	TransactionId int       `json:"transaction_id"`
	Quantity      int       `json:"quantity"`
	// Product       Products     `gorm:"foreignKey:ProductsId"`
	// Transaction   Transactions `gorm:"foreignKey:TransactionId"`
	// User          Users        `gorm:"foreignKey:UserId"`

	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `json:"-"`
}
