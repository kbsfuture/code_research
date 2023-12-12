// ProductRouter.route("/")
//   .get(async (req, res, next) => {
//     try {

//       const result = await Product.find({});
//       return res.status(200).json({ products: result });

//       A)
//       const [products, itemCount] = await Promise.all([
//         Product.find({
//           _id: !req.query.id ? { $gte: firstProductId } : { $gt: req.query.id },
//         })
//           .limit(req.query.limit ? req.query.limit : 20)
//           .lean()
//           .exec(),
//         Product.find({
//           _id: !req.query.id ? { $gte: firstProductId } : { $gt: req.query.id },
//         }).count({}),
//       ]);

//       const hasNext = itemCount > (req.query.limit ? req.query.limit : 20);
//       res.json({
//         products: products,
//         data: products,
//         meta: {
//           hasMore: hasNext,
//           count: products.length,
//         },
//       });
//     } catch (err) {
//       console.error(err);
//       next(err);
//     }
//   })

// 위 코드에서 Promise.all 내부 로직은 async, await 형태로 다음과 같이 변환 가능하다

// B)
//   // 제품 조회
//     const products = await Product.find(queryCondition)
//     .limit(limit)
//     .lean();

//   // 총 제품 수 계산
//   const itemCount = await Product.count(queryCondition);

// A,B의 차이는 다음과 같다

// A의 경우
// Promise.all을 사용하여 Product.find()와 Product.count() 쿼리를 동시에 실행한다.
// Promise.all은 배열 내의 모든 프로미스가 완료될 때까지 기다린다.
// 이 경우, 두 쿼리는 병렬로 실행되어 각각의 결과(제품 목록과 총 제품 수)가 동시에 계산된다.

// B의 경우
// 두 비동기 작업을 순차적으로 실행한다.
// 먼저 Product.find() 쿼리를 실행하고 그 결과를 기다린 후, Product.count() 쿼리를 실행한다.
// 즉, 두 번째 쿼리는 첫 번째 쿼리가 완료된 후에 실행된다.

// A)은 두 쿼리를 동시에 실행하여 시간을 절약할 수 있지만,
// 한 쿼리에서 오류가 발생하면 전체가 실패합니다.
// B)은 두 쿼리를 순차적으로 실행하여 한 쿼리의 결과가 다른 쿼리의 실행에 영향을 주지 않지만,
// 전체 실행 시간이 더 길어질 수 있습니다.

// 따라서 선택은 사용 사례에 따라 달라집니다.
// 병렬 실행으로 시간을 절약하고자 한다면 Promise.all을,
// 각 쿼리의 독립성을 유지하면서 각각의 결과에 따라 유연하게 대응하고자 한다면
// async/await 순차 실행을 선택할 수 있습니다.
