from agent.cti.mapper import map_alert_to_technique

def test_umapped_real_signature():
    result = map_alert_to_technique(2228000)

    assert result is None


def test_unknown_signature():
    result = map_alert_to_technique(2260002)

    assert result is None