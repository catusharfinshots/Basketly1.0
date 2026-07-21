#!/usr/bin/env python3
"""
Backend API tests for Basketly Kite Connect integration.
Tests all backend endpoints as specified in the review request.
"""
import requests
import json
import sys

# Backend base URL from frontend/.env
BACKEND_URL = "https://fund-builder-5.preview.emergentagent.com"
API_BASE = f"{BACKEND_URL}/api"

def test_kite_login_url():
    """Test 1: GET /api/broker/kite/login-url"""
    print("\n" + "="*80)
    print("TEST 1: GET /api/broker/kite/login-url")
    print("="*80)
    
    try:
        response = requests.get(f"{API_BASE}/broker/kite/login-url", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 200:
            print("❌ FAILED: Expected status code 200")
            return False
        
        data = response.json()
        if "login_url" not in data:
            print("❌ FAILED: Response missing 'login_url' field")
            return False
        
        if "api_key" not in data:
            print("❌ FAILED: Response missing 'api_key' field")
            return False
        
        if not data["login_url"].startswith("https://kite.zerodha.com/connect/login?api_key="):
            print(f"❌ FAILED: login_url does not start with expected URL. Got: {data['login_url']}")
            return False
        
        print("✅ PASSED: Returns 200 with login_url and api_key")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_kite_status_nonexistent():
    """Test 2: GET /api/broker/kite/status?user_id=nonexistent_user_123"""
    print("\n" + "="*80)
    print("TEST 2: GET /api/broker/kite/status?user_id=nonexistent_user_123")
    print("="*80)
    
    try:
        response = requests.get(
            f"{API_BASE}/broker/kite/status",
            params={"user_id": "nonexistent_user_123"},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 200:
            print("❌ FAILED: Expected status code 200")
            return False
        
        data = response.json()
        if data.get("connected") != False:
            print(f"❌ FAILED: Expected connected=false, got: {data.get('connected')}")
            return False
        
        print("✅ PASSED: Returns 200 with connected=false")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_kite_exchange_invalid_token():
    """Test 3: POST /api/broker/kite/exchange with invalid token"""
    print("\n" + "="*80)
    print("TEST 3: POST /api/broker/kite/exchange with invalid token")
    print("="*80)
    
    try:
        payload = {
            "user_id": "test_user_abc",
            "request_token": "fake_invalid_token_xyz"
        }
        response = requests.post(
            f"{API_BASE}/broker/kite/exchange",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 400:
            print(f"❌ FAILED: Expected status code 400, got {response.status_code}")
            return False
        
        data = response.json()
        if "detail" not in data:
            print("❌ FAILED: Response missing 'detail' field")
            return False
        
        if not data["detail"].startswith("Kite token exchange failed"):
            print(f"❌ FAILED: detail does not start with 'Kite token exchange failed'. Got: {data['detail']}")
            return False
        
        print("✅ PASSED: Returns 400 with error detail starting with 'Kite token exchange failed'")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_kite_holdings_not_connected():
    """Test 4: GET /api/broker/kite/holdings?user_id=notconnected_user"""
    print("\n" + "="*80)
    print("TEST 4: GET /api/broker/kite/holdings?user_id=notconnected_user")
    print("="*80)
    
    try:
        response = requests.get(
            f"{API_BASE}/broker/kite/holdings",
            params={"user_id": "notconnected_user"},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 401:
            print(f"❌ FAILED: Expected status code 401, got {response.status_code}")
            return False
        
        data = response.json()
        if data.get("detail") != "Not connected":
            print(f"❌ FAILED: Expected detail='Not connected', got: {data.get('detail')}")
            return False
        
        print("✅ PASSED: Returns 401 with detail='Not connected'")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_kite_margins_not_connected():
    """Test 5: GET /api/broker/kite/margins?user_id=notconnected_user"""
    print("\n" + "="*80)
    print("TEST 5: GET /api/broker/kite/margins?user_id=notconnected_user")
    print("="*80)
    
    try:
        response = requests.get(
            f"{API_BASE}/broker/kite/margins",
            params={"user_id": "notconnected_user"},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 401:
            print(f"❌ FAILED: Expected status code 401, got {response.status_code}")
            return False
        
        data = response.json()
        if data.get("detail") != "Not connected":
            print(f"❌ FAILED: Expected detail='Not connected', got: {data.get('detail')}")
            return False
        
        print("✅ PASSED: Returns 401 with detail='Not connected'")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_kite_disconnect():
    """Test 6: POST /api/broker/kite/disconnect"""
    print("\n" + "="*80)
    print("TEST 6: POST /api/broker/kite/disconnect")
    print("="*80)
    
    try:
        payload = {"user_id": "any_user"}
        response = requests.post(
            f"{API_BASE}/broker/kite/disconnect",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected status code 200, got {response.status_code}")
            return False
        
        data = response.json()
        if data.get("ok") != True:
            print(f"❌ FAILED: Expected ok=true, got: {data.get('ok')}")
            return False
        
        print("✅ PASSED: Returns 200 with ok=true")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_kite_place_order_not_connected():
    """Test 7: POST /api/broker/kite/order with valid body but unconnected user"""
    print("\n" + "="*80)
    print("TEST 7: POST /api/broker/kite/order (unconnected user)")
    print("="*80)
    
    try:
        payload = {
            "user_id": "notconnected_user_abc",
            "exchange": "NSE",
            "tradingsymbol": "RELIANCE",
            "transaction_type": "BUY",
            "quantity": 1,
            "order_type": "MARKET",
            "product": "CNC",
            "variety": "regular",
            "validity": "DAY"
        }
        response = requests.post(
            f"{API_BASE}/broker/kite/order",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 401:
            print(f"❌ FAILED: Expected status code 401, got {response.status_code}")
            return False
        
        data = response.json()
        if data.get("detail") != "Not connected":
            print(f"❌ FAILED: Expected detail='Not connected', got: {data.get('detail')}")
            return False
        
        print("✅ PASSED: Returns 401 with detail='Not connected'")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_kite_place_order_missing_fields():
    """Test 8: POST /api/broker/kite/order with missing required fields (pydantic validation)"""
    print("\n" + "="*80)
    print("TEST 8: POST /api/broker/kite/order (missing required fields)")
    print("="*80)
    
    try:
        payload = {
            "user_id": "x",
            "exchange": "NSE"
            # Missing: tradingsymbol, transaction_type, quantity
        }
        response = requests.post(
            f"{API_BASE}/broker/kite/order",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 422:
            print(f"❌ FAILED: Expected status code 422 (Unprocessable Entity), got {response.status_code}")
            return False
        
        print("✅ PASSED: Returns 422 for missing required fields")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_kite_place_order_zero_quantity():
    """Test 9: POST /api/broker/kite/order with quantity=0"""
    print("\n" + "="*80)
    print("TEST 9: POST /api/broker/kite/order (quantity=0)")
    print("="*80)
    
    try:
        payload = {
            "user_id": "notconnected_user_abc",
            "exchange": "NSE",
            "tradingsymbol": "RELIANCE",
            "transaction_type": "BUY",
            "quantity": 0,  # Invalid: must be > 0
            "order_type": "MARKET",
            "product": "CNC",
            "variety": "regular",
            "validity": "DAY"
        }
        response = requests.post(
            f"{API_BASE}/broker/kite/order",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 422:
            print(f"❌ FAILED: Expected status code 422 (pydantic gt=0 validation), got {response.status_code}")
            return False
        
        print("✅ PASSED: Returns 422 for quantity=0")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_kite_orders_not_connected():
    """Test 10: GET /api/broker/kite/orders?user_id=notconnected_user_abc"""
    print("\n" + "="*80)
    print("TEST 10: GET /api/broker/kite/orders (unconnected user)")
    print("="*80)
    
    try:
        response = requests.get(
            f"{API_BASE}/broker/kite/orders",
            params={"user_id": "notconnected_user_abc"},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 401:
            print(f"❌ FAILED: Expected status code 401, got {response.status_code}")
            return False
        
        data = response.json()
        if data.get("detail") != "Not connected":
            print(f"❌ FAILED: Expected detail='Not connected', got: {data.get('detail')}")
            return False
        
        print("✅ PASSED: Returns 401 with detail='Not connected'")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_kite_cancel_order_not_connected():
    """Test 11: POST /api/broker/kite/order/cancel (unconnected user)"""
    print("\n" + "="*80)
    print("TEST 11: POST /api/broker/kite/order/cancel (unconnected user)")
    print("="*80)
    
    try:
        payload = {
            "user_id": "notconnected_user_abc",
            "order_id": "12345",
            "variety": "regular"
        }
        response = requests.post(
            f"{API_BASE}/broker/kite/order/cancel",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 401:
            print(f"❌ FAILED: Expected status code 401, got {response.status_code}")
            return False
        
        data = response.json()
        if data.get("detail") != "Not connected":
            print(f"❌ FAILED: Expected detail='Not connected', got: {data.get('detail')}")
            return False
        
        print("✅ PASSED: Returns 401 with detail='Not connected'")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_kite_ltp_not_connected():
    """Test 12: GET /api/broker/kite/ltp (unconnected user)"""
    print("\n" + "="*80)
    print("TEST 12: GET /api/broker/kite/ltp (unconnected user)")
    print("="*80)
    
    try:
        response = requests.get(
            f"{API_BASE}/broker/kite/ltp",
            params={"user_id": "notconnected_user_abc", "symbols": "NSE:RELIANCE"},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 401:
            print(f"❌ FAILED: Expected status code 401, got {response.status_code}")
            return False
        
        data = response.json()
        if data.get("detail") != "Not connected":
            print(f"❌ FAILED: Expected detail='Not connected', got: {data.get('detail')}")
            return False
        
        print("✅ PASSED: Returns 401 with detail='Not connected'")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_kite_quote_not_connected():
    """Test 13: GET /api/broker/kite/quote (unconnected user)"""
    print("\n" + "="*80)
    print("TEST 13: GET /api/broker/kite/quote (unconnected user)")
    print("="*80)
    
    try:
        response = requests.get(
            f"{API_BASE}/broker/kite/quote",
            params={"user_id": "notconnected_user_abc", "symbols": "NSE:RELIANCE"},
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 401:
            print(f"❌ FAILED: Expected status code 401, got {response.status_code}")
            return False
        
        data = response.json()
        if data.get("detail") != "Not connected":
            print(f"❌ FAILED: Expected detail='Not connected', got: {data.get('detail')}")
            return False
        
        print("✅ PASSED: Returns 401 with detail='Not connected'")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def main():
    """Run all backend tests"""
    print("\n" + "="*80)
    print("BASKETLY KITE CONNECT BACKEND API TESTS")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"API Base: {API_BASE}")
    print("="*80)
    
    tests = [
        ("Kite login-url endpoint", test_kite_login_url),
        ("Kite status endpoint (nonexistent user)", test_kite_status_nonexistent),
        ("Kite exchange endpoint (invalid token)", test_kite_exchange_invalid_token),
        ("Kite holdings endpoint (not connected)", test_kite_holdings_not_connected),
        ("Kite margins endpoint (not connected)", test_kite_margins_not_connected),
        ("Kite disconnect endpoint", test_kite_disconnect),
        ("Kite place_order endpoint (unconnected user)", test_kite_place_order_not_connected),
        ("Kite place_order endpoint (missing fields)", test_kite_place_order_missing_fields),
        ("Kite place_order endpoint (quantity=0)", test_kite_place_order_zero_quantity),
        ("Kite orders endpoint (unconnected user)", test_kite_orders_not_connected),
        ("Kite cancel_order endpoint (unconnected user)", test_kite_cancel_order_not_connected),
        ("Kite ltp endpoint (unconnected user)", test_kite_ltp_not_connected),
        ("Kite quote endpoint (unconnected user)", test_kite_quote_not_connected),
    ]
    
    results = []
    for name, test_func in tests:
        try:
            passed = test_func()
            results.append((name, passed))
        except Exception as e:
            print(f"\n❌ Test '{name}' crashed: {e}")
            results.append((name, False))
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    passed_count = sum(1 for _, passed in results if passed)
    total_count = len(results)
    
    for name, passed in results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{status}: {name}")
    
    print(f"\nTotal: {passed_count}/{total_count} tests passed")
    print("="*80)
    
    return 0 if passed_count == total_count else 1


if __name__ == "__main__":
    sys.exit(main())
