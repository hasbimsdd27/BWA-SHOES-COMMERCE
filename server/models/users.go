package models

import (
	"database/sql/driver"
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type UserType string

const (
	USER  UserType = "USER"
	ADMIN UserType = "ADMIN"
)

func (ut *UserType) Scan(value interface{}) error {
	*ut = UserType(value.([]byte))
	return nil
}

func (ut UserType) Value() (driver.Value, error) {
	return string(ut), nil
}

type Users struct {
	ID        uint   `json:"id" gorm:"primary_key;autoIncrement"`
	Username  string `json:"username"`
	Name      string `json:"name"`
	Password  string
	Role      UserType `json:"role"`
	Phone     string   `json:"phone"`
	Email     string   `json:"email"`
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt
}

func (u *Users) setPassword(password string) error {
	if len(password) == 0 {
		return errors.New("password should not be empty!")
	}
	bytePassword := []byte(password)
	// Make sure the second param `bcrypt generator cost` between [4, 32)
	passwordHash, _ := bcrypt.GenerateFromPassword(bytePassword, bcrypt.DefaultCost)
	u.Password = string(passwordHash)
	return nil
}
