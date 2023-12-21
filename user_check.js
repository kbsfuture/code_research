const { name, phoneNumber, certificationNumber } = req.body;

const existingUser = await User.findOne({ phoneNumber });

if (!existingUser) {
  // phoneNumber와 일치하는 사용자가 없으면 signUpToken 생성
  const signUpToken = await signAccessToken(`${phoneNumber}-signUp`);
  res.send({ signUpToken: signUpToken });
} else {
  // phoneNumber와 일치하는 사용자가 있으면 name을 비교하여 에러를 발생시키거나 토큰을 생성할 수 있음
  if (existingUser.name !== name) {
    // name이 일치하지 않으면 에러 발생
    const error = new Error("Name does not match");
    // 에러 상태 코드를 설정하고 에러를 다음 미들웨어로 전달
    error.status = 400; // 예시로 400 Bad Request로 설정
    next(error);
  } else {
    // name과 phoneNumber 모두 일치하면 고객 토큰 생성
    const accessToken = await signAccessToken(`${existingUser.id}-user`);
    const refreshToken = await signRefreshToken(`${existingUser.id}-user`);
    res.cookie("refresh_token", refreshToken, {
      maxAge: 60 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
    });
    res.send({ accessToken: accessToken });
  }
}

// 여러 조건이 필요할 경우 1차적으로 우선조건으로 분기를 친후 if문을 중첩으로 형성
