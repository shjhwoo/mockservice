package application

import (
	"fmt"
	"net/http"

	"golang.org/x/oauth2"
)

func ssologinHandler(w http.ResponseWriter, r *http.Request){
	fmt.Println("요청확인")
	//클라이언트 정보에 따라 통합 로그인 페이지 접속 url을 만들어 준 후 그쪽으로 사용자를 보내준다.
	//0.클라이언트 설정
	c := oauth2.Config{
		ClientID: "vegas",
		ClientSecret: "foobar",
		RedirectURL: "http://localhost:3006/callback",
		Scopes: []string{"openid", "offline"},
		Endpoint: oauth2.Endpoint{
			TokenURL: "http://localhost:8080/oauth2/token",
			AuthURL:  "http://localhost:8080/oauth2/auth",
		},
	}

	// pkceCodeVerifier := generateCodeVerifier(64)
	// fmt.Println(pkceCodeVerifier,"&")
	// pkceCodeChallenge = generateCodeChallenge(pkceCodeVerifier)

	//1.sso통합 로그인 페이지 생성
	ssoLoginURL := c.AuthCodeURL("some-random-state-foobar")+"&nonce=some-random-nonce"
	//ssoLoginURL := c.AuthCodeURL("nuclear-tuna-plays-piano")+"&nonce=some-random-nonce&code_challenge="+pkceCodeChallenge+"&code_challenge_method=S256"

	//2.사용자 리디렉션
	http.Redirect(w, r, ssoLoginURL, http.StatusSeeOther)
}