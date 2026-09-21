import time
import pytest
from pathlib import Path
from agent.cti.watcher import watch_file

class StopWatcher(Exception):
    pass

@pytest.fixture
def mock_sleep(monkeypatch):
    def fake_sleep(*args, **kwargs):
        raise StopWatcher()
    monkeypatch.setattr(time, "sleep", fake_sleep)

def test_watcher_offset_persistence_and_resume(tmp_path, monkeypatch, mock_sleep):
    log_file = tmp_path / "eve.json"
    state_file = tmp_path / "offset.state"
    
    # 1. Write some initial data
    log_file.write_text('{"event_type": "alert", "alert": {"signature_id": 1, "signature": "A"}, "src_ip": "1.1.1.1", "flow_id": 1, "timestamp": "2026-09-20T00:00:00"}\n', encoding="utf-8")
    
    # 2. First run without state file - it should seek to EOF and persist offset
    try:
        watch_file(str(log_file), state_file=str(state_file))
    except StopWatcher:
        pass
        
    # Verify offset is persisted
    assert state_file.exists()
    offset1 = int(state_file.read_text().strip())
    assert offset1 > 0
    
    # 3. Intercept ingest_alert_line to track what gets processed
    processed = []
    def fake_ingest(line):
        processed.append(line)
        return None
        
    monkeypatch.setattr("agent.cti.watcher.ingest_alert_line", fake_ingest)
    
    # 4. Append new data (after the saved offset)
    with log_file.open("a", encoding="utf-8") as f:
        f.write('{"event_type": "alert", "alert": {"signature_id": 2, "signature": "B"}, "src_ip": "2.2.2.2", "flow_id": 2, "timestamp": "2026-09-20T00:00:01"}\n')
        
    # 5. Second run - should load offset and process ONLY the new data
    try:
        watch_file(str(log_file), state_file=str(state_file))
    except StopWatcher:
        pass
        
    # Verify the offset advanced
    offset2 = int(state_file.read_text().strip())
    assert offset2 > offset1
    
    # Verify ONLY the newly appended line was processed (old data ignored)
    assert len(processed) == 1
    assert "signature_id\": 2" in processed[0]
