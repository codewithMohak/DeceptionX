package perception

import (
	 "encoding/json"
)

func ParseLine(line []byte) (NormalizedEvent, error){
	var raw RawAlert

	if err := json.Unmarshal(line, &raw); err !=nil{
		return NormalizedEvent{}, err
	}
	return normailze(raw), nil
}