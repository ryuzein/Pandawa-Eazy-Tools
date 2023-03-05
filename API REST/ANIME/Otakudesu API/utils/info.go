package utils

import "strings"

// GetDetailInfo split label and info
func GetDetailInfo(txt string) string {
	result := strings.Split(txt, ": ")

	return result[1]
}
