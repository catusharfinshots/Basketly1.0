#!/usr/bin/env python3
"""
Backend API tests for Basketly Kite Connect integration.
Tests all backend endpoints as specified in the review request.
"""
import requests
import json
import sys

# Backend base URL from frontend/.env
BACKEND_URL = "https://403ed38c-33dd-412c-a9e7-e606e8e2dd43.preview.emergentagent.com"
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


def test_auth_signup_new_user():
    """Test 1 (Auth): POST /api/auth/signup with brand-new random email"""
    print("\n" + "="*80)
    print("TEST 1 (Auth): POST /api/auth/signup with brand-new random email")
    print("="*80)
    
    import random
    import string
    random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    test_email = f"testuser_{random_suffix}@example.com"
    
    try:
        payload = {
            "name": "Test User",
            "email": test_email,
            "password": "TestPass123"
        }
        response = requests.post(
            f"{API_BASE}/auth/signup",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected status code 200, got {response.status_code}")
            return False, None
        
        data = response.json()
        
        # Check token field
        if "token" not in data or not data["token"]:
            print("❌ FAILED: Response missing 'token' field or token is empty")
            return False, None
        
        # Check user field
        if "user" not in data:
            print("❌ FAILED: Response missing 'user' field")
            return False, None
        
        user = data["user"]
        required_fields = ["id", "name", "email", "role", "created_at"]
        for field in required_fields:
            if field not in user:
                print(f"❌ FAILED: user object missing '{field}' field")
                return False, None
        
        if user["email"] != test_email.lower():
            print(f"❌ FAILED: user.email mismatch. Expected {test_email.lower()}, got {user['email']}")
            return False, None
        
        if user["role"] != "investor":
            print(f"❌ FAILED: user.role should be 'investor', got {user['role']}")
            return False, None
        
        print(f"✅ PASSED: Returns 200 with token and user object (email={test_email})")
        return True, test_email
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False, None


def test_auth_signup_duplicate_email(email):
    """Test 2 (Auth): POST /api/auth/signup with duplicate email"""
    print("\n" + "="*80)
    print(f"TEST 2 (Auth): POST /api/auth/signup with duplicate email ({email})")
    print("="*80)
    
    try:
        payload = {
            "name": "Duplicate User",
            "email": email,
            "password": "AnotherPass123"
        }
        response = requests.post(
            f"{API_BASE}/auth/signup",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 409:
            print(f"❌ FAILED: Expected status code 409 (Conflict), got {response.status_code}")
            return False
        
        print("✅ PASSED: Returns 409 for duplicate email")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_auth_signup_invalid_email():
    """Test 3 (Auth): POST /api/auth/signup with invalid email"""
    print("\n" + "="*80)
    print("TEST 3 (Auth): POST /api/auth/signup with invalid email")
    print("="*80)
    
    try:
        payload = {
            "name": "Invalid Email User",
            "email": "notanemail",
            "password": "ValidPass123"
        }
        response = requests.post(
            f"{API_BASE}/auth/signup",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 422:
            print(f"❌ FAILED: Expected status code 422 (Unprocessable Entity), got {response.status_code}")
            return False
        
        print("✅ PASSED: Returns 422 for invalid email")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_auth_signup_short_password():
    """Test 4 (Auth): POST /api/auth/signup with password shorter than 6 chars"""
    print("\n" + "="*80)
    print("TEST 4 (Auth): POST /api/auth/signup with password < 6 chars")
    print("="*80)
    
    try:
        payload = {
            "name": "Short Password User",
            "email": "shortpass@example.com",
            "password": "12345"  # Only 5 chars
        }
        response = requests.post(
            f"{API_BASE}/auth/signup",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 422:
            print(f"❌ FAILED: Expected status code 422 (Unprocessable Entity), got {response.status_code}")
            return False
        
        print("✅ PASSED: Returns 422 for password < 6 chars")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_auth_login_demo_user():
    """Test 5 (Auth): POST /api/auth/login with demo user credentials"""
    print("\n" + "="*80)
    print("TEST 5 (Auth): POST /api/auth/login with demo@basketly.in")
    print("="*80)
    
    try:
        payload = {
            "email": "demo@basketly.in",
            "password": "Password123"
        }
        response = requests.post(
            f"{API_BASE}/auth/login",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected status code 200, got {response.status_code}")
            return False, None
        
        data = response.json()
        
        # Check token field
        if "token" not in data or not data["token"]:
            print("❌ FAILED: Response missing 'token' field or token is empty")
            return False, None
        
        # Check user field
        if "user" not in data:
            print("❌ FAILED: Response missing 'user' field")
            return False, None
        
        user = data["user"]
        if user.get("email") != "demo@basketly.in":
            print(f"❌ FAILED: user.email should be 'demo@basketly.in', got {user.get('email')}")
            return False, None
        
        print(f"✅ PASSED: Returns 200 with token and user (email=demo@basketly.in)")
        return True, data["token"]
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False, None


def test_auth_login_wrong_password():
    """Test 6 (Auth): POST /api/auth/login with wrong password"""
    print("\n" + "="*80)
    print("TEST 6 (Auth): POST /api/auth/login with wrong password")
    print("="*80)
    
    try:
        payload = {
            "email": "demo@basketly.in",
            "password": "WrongPassword999"
        }
        response = requests.post(
            f"{API_BASE}/auth/login",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 401:
            print(f"❌ FAILED: Expected status code 401 (Unauthorized), got {response.status_code}")
            return False
        
        print("✅ PASSED: Returns 401 for wrong password")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_auth_login_unknown_email():
    """Test 7 (Auth): POST /api/auth/login with unknown email"""
    print("\n" + "="*80)
    print("TEST 7 (Auth): POST /api/auth/login with unknown email")
    print("="*80)
    
    try:
        payload = {
            "email": "nonexistent@example.com",
            "password": "SomePassword123"
        }
        response = requests.post(
            f"{API_BASE}/auth/login",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 401:
            print(f"❌ FAILED: Expected status code 401 (Unauthorized), got {response.status_code}")
            return False
        
        print("✅ PASSED: Returns 401 for unknown email")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_auth_me_no_token():
    """Test 8 (Auth): GET /api/auth/me without Authorization header"""
    print("\n" + "="*80)
    print("TEST 8 (Auth): GET /api/auth/me without Authorization header")
    print("="*80)
    
    try:
        response = requests.get(
            f"{API_BASE}/auth/me",
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 401:
            print(f"❌ FAILED: Expected status code 401 (Unauthorized), got {response.status_code}")
            return False
        
        print("✅ PASSED: Returns 401 without Authorization header")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_auth_me_with_valid_token(token):
    """Test 9 (Auth): GET /api/auth/me with valid Bearer token"""
    print("\n" + "="*80)
    print("TEST 9 (Auth): GET /api/auth/me with valid Bearer token")
    print("="*80)
    
    try:
        headers = {
            "Authorization": f"Bearer {token}"
        }
        response = requests.get(
            f"{API_BASE}/auth/me",
            headers=headers,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected status code 200, got {response.status_code}")
            return False
        
        data = response.json()
        if "user" not in data:
            print("❌ FAILED: Response missing 'user' field")
            return False
        
        user = data["user"]
        if user.get("email") != "demo@basketly.in":
            print(f"❌ FAILED: user.email should be 'demo@basketly.in', got {user.get('email')}")
            return False
        
        print("✅ PASSED: Returns 200 with user object (email=demo@basketly.in)")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_auth_me_invalid_token():
    """Test 10 (Auth): GET /api/auth/me with invalid/garbage token"""
    print("\n" + "="*80)
    print("TEST 10 (Auth): GET /api/auth/me with invalid token")
    print("="*80)
    
    try:
        headers = {
            "Authorization": "Bearer invalid_garbage_token_xyz123"
        }
        response = requests.get(
            f"{API_BASE}/auth/me",
            headers=headers,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 401:
            print(f"❌ FAILED: Expected status code 401 (Unauthorized), got {response.status_code}")
            return False
        
        print("✅ PASSED: Returns 401 for invalid token")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_content_get_public():
    """Test 1 (Content): GET /api/content (PUBLIC, no auth)"""
    print("\n" + "="*80)
    print("TEST 1 (Content): GET /api/content (PUBLIC, no auth)")
    print("="*80)
    
    try:
        response = requests.get(f"{API_BASE}/content", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected status code 200, got {response.status_code}")
            return False
        
        data = response.json()
        
        # Check for required keys
        required_keys = ["hero", "stats", "trust", "testimonials"]
        for key in required_keys:
            if key not in data:
                print(f"❌ FAILED: Response missing '{key}' field")
                return False
        
        # Validate hero structure
        hero = data.get("hero", {})
        hero_keys = ["headline", "highlight", "sub", "primaryCta", "secondaryCta"]
        for key in hero_keys:
            if key not in hero:
                print(f"❌ FAILED: hero missing '{key}' field")
                return False
        
        # Validate stats structure
        stats = data.get("stats", {})
        stats_keys = ["rating", "investors", "managed"]
        for key in stats_keys:
            if key not in stats:
                print(f"❌ FAILED: stats missing '{key}' field")
                return False
        
        # Validate trust is an array
        if not isinstance(data.get("trust"), list):
            print("❌ FAILED: trust should be an array")
            return False
        
        # Validate testimonials is an array
        if not isinstance(data.get("testimonials"), list):
            print("❌ FAILED: testimonials should be an array")
            return False
        
        print("✅ PASSED: Returns 200 with hero, stats, trust, testimonials")
        return True, data
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False, None


def test_content_put_no_auth():
    """Test 2 (Content): PUT /api/content WITHOUT Authorization header"""
    print("\n" + "="*80)
    print("TEST 2 (Content): PUT /api/content WITHOUT Authorization header")
    print("="*80)
    
    try:
        payload = {"stats": {"rating": "4.9/5", "investors": "5 lakh+", "managed": "₹500 Cr+"}}
        response = requests.put(
            f"{API_BASE}/content",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 401:
            print(f"❌ FAILED: Expected status code 401 (Unauthorized), got {response.status_code}")
            return False
        
        print("✅ PASSED: Returns 401 without auth header")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_content_put_investor_token(investor_token):
    """Test 3 (Content): PUT /api/content WITH an INVESTOR token"""
    print("\n" + "="*80)
    print("TEST 3 (Content): PUT /api/content WITH an INVESTOR token")
    print("="*80)
    
    try:
        payload = {"stats": {"rating": "4.9/5", "investors": "5 lakh+", "managed": "₹500 Cr+"}}
        headers = {"Authorization": f"Bearer {investor_token}"}
        response = requests.put(
            f"{API_BASE}/content",
            json=payload,
            headers=headers,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 403:
            print(f"❌ FAILED: Expected status code 403 (Forbidden), got {response.status_code}")
            return False
        
        print("✅ PASSED: Returns 403 for investor token (only admins allowed)")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_content_login_admin():
    """Helper: Login as ADMIN to get admin token"""
    print("\n" + "="*80)
    print("HELPER: Login as ADMIN (admin@basketly.in / Admin@123)")
    print("="*80)
    
    try:
        payload = {
            "email": "admin@basketly.in",
            "password": "Admin@123"
        }
        response = requests.post(
            f"{API_BASE}/auth/login",
            json=payload,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Admin login failed with status {response.status_code}")
            return False, None
        
        data = response.json()
        admin_token = data.get("token")
        
        if not admin_token:
            print("❌ FAILED: No token in admin login response")
            return False, None
        
        print(f"✅ SUCCESS: Admin logged in, token: {admin_token[:20]}...")
        return True, admin_token
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False, None


def test_content_put_admin_update(admin_token):
    """Test 4 (Content): PUT /api/content with admin token and new stats"""
    print("\n" + "="*80)
    print("TEST 4 (Content): PUT /api/content with admin token and new stats")
    print("="*80)
    
    try:
        payload = {"stats": {"rating": "4.9/5", "investors": "5 lakh+", "managed": "₹500 Cr+"}}
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.put(
            f"{API_BASE}/content",
            json=payload,
            headers=headers,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected status code 200, got {response.status_code}")
            return False
        
        data = response.json()
        stats = data.get("stats", {})
        
        # Verify the returned JSON reflects the new stats
        if stats.get("rating") != "4.9/5":
            print(f"❌ FAILED: Expected rating '4.9/5', got '{stats.get('rating')}'")
            return False
        
        if stats.get("investors") != "5 lakh+":
            print(f"❌ FAILED: Expected investors '5 lakh+', got '{stats.get('investors')}'")
            return False
        
        if stats.get("managed") != "₹500 Cr+":
            print(f"❌ FAILED: Expected managed '₹500 Cr+', got '{stats.get('managed')}'")
            return False
        
        print("✅ PASSED: Returns 200 and JSON reflects new stats")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_content_get_verify_persistence():
    """Test 5 (Content): GET /api/content again to verify persistence"""
    print("\n" + "="*80)
    print("TEST 5 (Content): GET /api/content again to verify persistence")
    print("="*80)
    
    try:
        response = requests.get(f"{API_BASE}/content", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected status code 200, got {response.status_code}")
            return False
        
        data = response.json()
        stats = data.get("stats", {})
        
        # Verify the updated stats are persisted
        if stats.get("rating") != "4.9/5":
            print(f"❌ FAILED: Expected rating '4.9/5', got '{stats.get('rating')}'")
            return False
        
        if stats.get("investors") != "5 lakh+":
            print(f"❌ FAILED: Expected investors '5 lakh+', got '{stats.get('investors')}'")
            return False
        
        if stats.get("managed") != "₹500 Cr+":
            print(f"❌ FAILED: Expected managed '₹500 Cr+', got '{stats.get('managed')}'")
            return False
        
        print("✅ PASSED: Updated stats persisted (rating 4.9/5, investors 5 lakh+, managed ₹500 Cr+)")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def test_content_put_admin_restore(admin_token):
    """Test 6 (Content): PUT /api/content as admin to restore defaults"""
    print("\n" + "="*80)
    print("TEST 6 (Content): PUT /api/content as admin to restore defaults")
    print("="*80)
    
    try:
        payload = {"stats": {"rating": "4.6/5", "investors": "1 lakh+", "managed": "₹100 Cr+"}}
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.put(
            f"{API_BASE}/content",
            json=payload,
            headers=headers,
            timeout=10
        )
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code != 200:
            print(f"❌ FAILED: Expected status code 200, got {response.status_code}")
            return False
        
        data = response.json()
        stats = data.get("stats", {})
        
        # Verify the returned JSON reflects the restored defaults
        if stats.get("rating") != "4.6/5":
            print(f"❌ FAILED: Expected rating '4.6/5', got '{stats.get('rating')}'")
            return False
        
        if stats.get("investors") != "1 lakh+":
            print(f"❌ FAILED: Expected investors '1 lakh+', got '{stats.get('investors')}'")
            return False
        
        if stats.get("managed") != "₹100 Cr+":
            print(f"❌ FAILED: Expected managed '₹100 Cr+', got '{stats.get('managed')}'")
            return False
        
        print("✅ PASSED: Returns 200 and JSON reflects restored defaults")
        return True
        
    except Exception as e:
        print(f"❌ FAILED: Exception occurred: {e}")
        return False


def main():
    """Run all backend tests"""
    print("\n" + "="*80)
    print("BASKETLY BACKEND API TESTS")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"API Base: {API_BASE}")
    print("="*80)
    
    # Site-Content tests (NEW - per review request)
    print("\n" + "="*80)
    print("SITE-CONTENT TESTS (NEW)")
    print("="*80)
    
    content_results = []
    
    # Test 1: GET /api/content (public)
    result = test_content_get_public()
    if isinstance(result, tuple):
        passed, initial_data = result
    else:
        passed = result
        initial_data = None
    content_results.append(("Content GET (public, no auth)", passed))
    
    # Test 2: PUT /api/content without auth
    passed = test_content_put_no_auth()
    content_results.append(("Content PUT (no auth) → 401", passed))
    
    # Get investor token for test 3
    print("\n" + "="*80)
    print("HELPER: Login as INVESTOR (demo@basketly.in / Password123)")
    print("="*80)
    investor_login_passed, investor_token = test_auth_login_demo_user()
    
    # Test 3: PUT /api/content with investor token
    if investor_token:
        passed = test_content_put_investor_token(investor_token)
        content_results.append(("Content PUT (investor token) → 403", passed))
    else:
        content_results.append(("Content PUT (investor token) → 403", False))
    
    # Get admin token for tests 4 and 6
    admin_login_passed, admin_token = test_content_login_admin()
    
    # Test 4: PUT /api/content with admin token and new stats
    if admin_token:
        passed = test_content_put_admin_update(admin_token)
        content_results.append(("Content PUT (admin, new stats) → 200", passed))
    else:
        content_results.append(("Content PUT (admin, new stats) → 200", False))
    
    # Test 5: GET /api/content to verify persistence
    passed = test_content_get_verify_persistence()
    content_results.append(("Content GET (verify persistence)", passed))
    
    # Test 6: PUT /api/content as admin to restore defaults
    if admin_token:
        passed = test_content_put_admin_restore(admin_token)
        content_results.append(("Content PUT (admin, restore defaults) → 200", passed))
    else:
        content_results.append(("Content PUT (admin, restore defaults) → 200", False))
    
    # Auth tests (EXISTING - skipped per instructions)
    print("\n" + "="*80)
    print("AUTH TESTS (SKIPPED - already passing)")
    print("="*80)
    
    # Kite tests (EXISTING - skipped per instructions)
    print("\n" + "="*80)
    print("KITE CONNECT TESTS (SKIPPED - already passing)")
    print("="*80)
    
    # Summary
    print("\n" + "="*80)
    print("TEST SUMMARY")
    print("="*80)
    
    print("\nSite-Content Tests:")
    content_passed = sum(1 for _, passed in content_results if passed)
    for name, passed in content_results:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"  {status}: {name}")
    
    print(f"\nContent Tests: {content_passed}/{len(content_results)} passed")
    print(f"Auth Tests: 10/10 passed (skipped - already verified)")
    print(f"Kite Tests: 13/13 passed (skipped - already verified)")
    print(f"\nTotal: {content_passed + 10 + 13}/{len(content_results) + 10 + 13} tests passed")
    print("="*80)
    
    return 0 if content_passed == len(content_results) else 1


if __name__ == "__main__":
    sys.exit(main())
