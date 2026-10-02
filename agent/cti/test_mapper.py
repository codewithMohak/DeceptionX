from agent.cti.mapper import map_alert_to_technique

def test_umapped_real_signature():
    result = map_alert_to_technique(2228000)

    assert result is None


def test_unknown_signature():
    result = map_alert_to_technique(2260002)

    assert result is None

def test_nmap_user_agent_maps_to_active_scanning():
    result = map_alert_to_technique(2024364)

    assert result is not None
    assert result.technique_id == "T1595"
    assert result.technique_name == "Active Scanning"
    assert result.tactic == "Reconnaissance"