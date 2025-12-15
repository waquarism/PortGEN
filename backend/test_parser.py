import sys
import os

# Ensure we can import parser_module
sys.path.append(os.path.dirname(__file__))

from app.services.parser import parse_resume

def test():
    print("Testing parse_resume with test_resume.txt...")
    try:
        data = parse_resume("test_resume.txt")
        print("\n--- Parsed Data ---")
        import json
        print(json.dumps(data, indent=2, ensure_ascii=False))
        
        # Simple assertions
        assert "John Doe" in data["personalInfo"]["fullName"] or "John Doe" in str(data)
        assert "john.doe@example.com" in data["personalInfo"]["email"]
        print("\nSUCCESS: Parsing completed and basic checks passed.")
    except Exception as e:
        print(f"\nFAILURE: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test()
