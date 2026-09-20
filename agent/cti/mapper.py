from dataclasses import dataclass
from pathlib import Path
import yaml

@dataclass(frozen=True)
class TechniqueMatch:
    technique_id: str
    technique_name: str
    tactic: str

MAP_FILE = Path(__file__).with_name("mitre_map.yaml")

def map_alert_to_technique(signature_id: int) -> TechniqueMatch | None:
    with MAP_FILE.open("r", encoding= "utf-8") as file:
        mappings = yaml.safe_load(file) or {}

    mapping = mappings.get(signature_id)

    if mapping is None:
        print(f"unmapped signature: {signature_id}")
        return None

    return TechniqueMatch(
        technique_id=mapping["technique_id"],
        technique_name=mapping["technique_name"],
        tactic=mapping["tactic"],
    )