��e x p o r t   t y p e   J s o n   =  
 	 |   s t r i n g  
 	 |   n u m b e r  
 	 |   b o o l e a n  
 	 |   n u l l  
 	 |   {   [ k e y :   s t r i n g ] :   J s o n   |   u n d e f i n e d   }  
 	 |   J s o n [ ] ;  
  
 e x p o r t   i n t e r f a c e   D a t a b a s e   {  
 	 p u b l i c :   {  
 	 	 T a b l e s :   {  
 	 	 	 g l o b a l _ t o p i c s :   {  
 	 	 	 	 R o w :   {  
 	 	 	 	 	 i d :   n u m b e r ;  
 	 	 	 	 	 t o p i c :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t o p i c _ s h o r t :   s t r i n g   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 I n s e r t :   {  
 	 	 	 	 	 i d ? :   n e v e r ;  
 	 	 	 	 	 t o p i c ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t o p i c _ s h o r t ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 U p d a t e :   {  
 	 	 	 	 	 i d ? :   n e v e r ;  
 	 	 	 	 	 t o p i c ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t o p i c _ s h o r t ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 R e l a t i o n s h i p s :   [ ] ;  
 	 	 	 } ;  
 	 	 	 p r o b l e m _ f e e d b a c k :   {  
 	 	 	 	 R o w :   {  
 	 	 	 	 	 a n s w e r :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 c o r r e c t :   b o o l e a n   |   n u l l ;  
 	 	 	 	 	 f e e d b a c k :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 i d :   n u m b e r ;  
 	 	 	 	 	 p r o b l e m _ i d :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 r e s o l v e d :   b o o l e a n ;  
 	 	 	 	 	 s o l v e r _ i d :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t e s t s o l v e _ i d :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 I n s e r t :   {  
 	 	 	 	 	 a n s w e r ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 c o r r e c t ? :   b o o l e a n   |   n u l l ;  
 	 	 	 	 	 f e e d b a c k ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 i d ? :   n e v e r ;  
 	 	 	 	 	 p r o b l e m _ i d ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 r e s o l v e d ? :   b o o l e a n ;  
 	 	 	 	 	 s o l v e r _ i d ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t e s t s o l v e _ i d ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 U p d a t e :   {  
 	 	 	 	 	 a n s w e r ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 c o r r e c t ? :   b o o l e a n   |   n u l l ;  
 	 	 	 	 	 f e e d b a c k ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 i d ? :   n e v e r ;  
 	 	 	 	 	 p r o b l e m _ i d ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 r e s o l v e d ? :   b o o l e a n ;  
 	 	 	 	 	 s o l v e r _ i d ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t e s t s o l v e _ i d ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 R e l a t i o n s h i p s :   [  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " p r o b l e m _ f e e d b a c k _ p r o b l e m _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " p r o b l e m _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " p r o b l e m s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " p r o b l e m _ f e e d b a c k _ p r o b l e m _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " p r o b l e m _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " f r o n t _ i d s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " p r o b l e m _ i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " p r o b l e m _ f e e d b a c k _ p r o b l e m _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " p r o b l e m _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " f u l l _ p r o b l e m s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " p r o b l e m _ f e e d b a c k _ p r o b l e m _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " p r o b l e m _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " u n u s e d _ p r o b l e m s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " p r o b l e m _ f e e d b a c k _ s o l v e r _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " s o l v e r _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " u s e r s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " p r o b l e m _ f e e d b a c k _ s o l v e r _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " s o l v e r _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " u s e r _ s t a t s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " p r o b l e m _ f e e d b a c k _ t e s t s o l v e _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " t e s t s o l v e _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " t e s t s o l v e s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 }  
 	 	 	 	 ] ;  
 	 	 	 } ;  
 	 	 	 p r o b l e m _ t o p i c s :   {  
 	 	 	 	 R o w :   {  
 	 	 	 	 	 i d :   n u m b e r ;  
 	 	 	 	 	 p r o b l e m _ i d :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 t o p i c _ i d :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 I n s e r t :   {  
 	 	 	 	 	 i d ? :   n e v e r ;  
 	 	 	 	 	 p r o b l e m _ i d ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 t o p i c _ i d ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 U p d a t e :   {  
 	 	 	 	 	 i d ? :   n e v e r ;  
 	 	 	 	 	 p r o b l e m _ i d ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 t o p i c _ i d ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 R e l a t i o n s h i p s :   [  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " p r o b l e m _ t o p i c s _ p r o b l e m _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " p r o b l e m _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " p r o b l e m s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " p r o b l e m _ t o p i c s _ p r o b l e m _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " p r o b l e m _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " f r o n t _ i d s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " p r o b l e m _ i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " p r o b l e m _ t o p i c s _ p r o b l e m _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " p r o b l e m _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " f u l l _ p r o b l e m s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " p r o b l e m _ t o p i c s _ p r o b l e m _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " p r o b l e m _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " u n u s e d _ p r o b l e m s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " p r o b l e m _ t o p i c s _ t o p i c _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " t o p i c _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " g l o b a l _ t o p i c s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 }  
 	 	 	 	 ] ;  
 	 	 	 } ;  
 	 	 	 p r o b l e m s :   {  
 	 	 	 	 R o w :   {  
 	 	 	 	 	 a n s w e r _ l a t e x :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 a r c h i v e d :   b o o l e a n ;  
 	 	 	 	 	 a u t h o r _ i d :   s t r i n g ;  
 	 	 	 	 	 c o m m e n t _ l a t e x :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 c r e a t e d _ a t :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 d i f f i c u l t y :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 e d i t e d _ a t :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 i d :   n u m b e r ;  
 	 	 	 	 	 n i c k n a m e :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 p r o b l e m _ l a t e x :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 s o l u t i o n _ l a t e x :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 s u b _ t o p i c s :   s t r i n g   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 I n s e r t :   {  
 	 	 	 	 	 a n s w e r _ l a t e x ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 a r c h i v e d ? :   b o o l e a n ;  
 	 	 	 	 	 a u t h o r _ i d ? :   s t r i n g ;  
 	 	 	 	 	 c o m m e n t _ l a t e x ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 c r e a t e d _ a t ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 d i f f i c u l t y ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 e d i t e d _ a t ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 i d ? :   n e v e r ;  
 	 	 	 	 	 n i c k n a m e ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 p r o b l e m _ l a t e x ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 s o l u t i o n _ l a t e x ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 s u b _ t o p i c s ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 U p d a t e :   {  
 	 	 	 	 	 a n s w e r _ l a t e x ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 a r c h i v e d ? :   b o o l e a n ;  
 	 	 	 	 	 a u t h o r _ i d ? :   s t r i n g ;  
 	 	 	 	 	 c o m m e n t _ l a t e x ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 c r e a t e d _ a t ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 d i f f i c u l t y ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 e d i t e d _ a t ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 i d ? :   n e v e r ;  
 	 	 	 	 	 n i c k n a m e ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 p r o b l e m _ l a t e x ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 s o l u t i o n _ l a t e x ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 s u b _ t o p i c s ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 R e l a t i o n s h i p s :   [  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " p r o b l e m s _ a u t h o r _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " a u t h o r _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " u s e r s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " p r o b l e m s _ a u t h o r _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " a u t h o r _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " u s e r _ s t a t s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 }  
 	 	 	 	 ] ;  
 	 	 	 } ;  
 	 	 	 t e s t _ c o o r d i n a t o r s :   {  
 	 	 	 	 R o w :   {  
 	 	 	 	 	 c o o r d i n a t o r _ i d :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 r e l a t i o n _ i d :   n u m b e r ;  
 	 	 	 	 	 t e s t _ i d :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 I n s e r t :   {  
 	 	 	 	 	 c o o r d i n a t o r _ i d ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 r e l a t i o n _ i d ? :   n e v e r ;  
 	 	 	 	 	 t e s t _ i d ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 U p d a t e :   {  
 	 	 	 	 	 c o o r d i n a t o r _ i d ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 r e l a t i o n _ i d ? :   n e v e r ;  
 	 	 	 	 	 t e s t _ i d ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 R e l a t i o n s h i p s :   [  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " t e s t _ c o o r d i n a t o r s _ c o o r d i n a t o r _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " c o o r d i n a t o r _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " u s e r s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " t e s t _ c o o r d i n a t o r s _ c o o r d i n a t o r _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " c o o r d i n a t o r _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " u s e r _ s t a t s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " t e s t _ c o o r d i n a t o r s _ t e s t _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " t e s t _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " t e s t s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 }  
 	 	 	 	 ] ;  
 	 	 	 } ;  
 	 	 	 t e s t _ c o o r d i n a t o r s _ c o p y :   {  
 	 	 	 	 R o w :   {  
 	 	 	 	 	 c o o r d i n a t o r _ i d :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 r e l a t i o n _ i d :   n u m b e r ;  
 	 	 	 	 	 t e s t _ i d :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 I n s e r t :   {  
 	 	 	 	 	 c o o r d i n a t o r _ i d ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 r e l a t i o n _ i d ? :   n u m b e r ;  
 	 	 	 	 	 t e s t _ i d ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 U p d a t e :   {  
 	 	 	 	 	 c o o r d i n a t o r _ i d ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 r e l a t i o n _ i d ? :   n u m b e r ;  
 	 	 	 	 	 t e s t _ i d ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 R e l a t i o n s h i p s :   [  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " t e s t _ c o o r d i n a t o r s _ c o p y _ c o o r d i n a t o r _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " c o o r d i n a t o r _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " u s e r s _ c o p y " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " t e s t _ c o o r d i n a t o r s _ c o p y _ t e s t _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " t e s t _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " t e s t s _ c o p y " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 }  
 	 	 	 	 ] ;  
 	 	 	 } ;  
 	 	 	 t e s t _ f e e d b a c k _ q u e s t i o n s :   {  
 	 	 	 	 R o w :   {  
 	 	 	 	 	 i d :   n u m b e r ;  
 	 	 	 	 	 q u e s t i o n :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t e s t _ i d :   n u m b e r ;  
 	 	 	 	 } ;  
 	 	 	 	 I n s e r t :   {  
 	 	 	 	 	 i d ? :   n e v e r ;  
 	 	 	 	 	 q u e s t i o n ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t e s t _ i d :   n u m b e r ;  
 	 	 	 	 } ;  
 	 	 	 	 U p d a t e :   {  
 	 	 	 	 	 i d ? :   n e v e r ;  
 	 	 	 	 	 q u e s t i o n ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t e s t _ i d ? :   n u m b e r ;  
 	 	 	 	 } ;  
 	 	 	 	 R e l a t i o n s h i p s :   [  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " t e s t _ f e e d b a c k _ q u e s t i o n s _ t e s t _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " t e s t _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " t e s t s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 }  
 	 	 	 	 ] ;  
 	 	 	 } ;  
 	 	 	 t e s t _ p r o b l e m s :   {  
 	 	 	 	 R o w :   {  
 	 	 	 	 	 p r o b l e m _ i d :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 p r o b l e m _ n u m b e r :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 r e l a t i o n _ i d :   n u m b e r ;  
 	 	 	 	 	 t e s t _ i d :   n u m b e r ;  
 	 	 	 	 } ;  
 	 	 	 	 I n s e r t :   {  
 	 	 	 	 	 p r o b l e m _ i d ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 p r o b l e m _ n u m b e r ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 r e l a t i o n _ i d ? :   n e v e r ;  
 	 	 	 	 	 t e s t _ i d :   n u m b e r ;  
 	 	 	 	 } ;  
 	 	 	 	 U p d a t e :   {  
 	 	 	 	 	 p r o b l e m _ i d ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 p r o b l e m _ n u m b e r ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 r e l a t i o n _ i d ? :   n e v e r ;  
 	 	 	 	 	 t e s t _ i d ? :   n u m b e r ;  
 	 	 	 	 } ;  
 	 	 	 	 R e l a t i o n s h i p s :   [  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " t e s t _ p r o b l e m s _ p r o b l e m _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " p r o b l e m _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " p r o b l e m s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " t e s t _ p r o b l e m s _ p r o b l e m _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " p r o b l e m _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " f r o n t _ i d s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " p r o b l e m _ i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " t e s t _ p r o b l e m s _ p r o b l e m _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " p r o b l e m _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " f u l l _ p r o b l e m s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " t e s t _ p r o b l e m s _ p r o b l e m _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " p r o b l e m _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " u n u s e d _ p r o b l e m s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " t e s t _ p r o b l e m s _ t e s t _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " t e s t _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " t e s t s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 }  
 	 	 	 	 ] ;  
 	 	 	 } ;  
 	 	 	 t e s t s :   {  
 	 	 	 	 R o w :   {  
 	 	 	 	 	 a r c h i v e d :   b o o l e a n ;  
 	 	 	 	 	 i d :   n u m b e r ;  
 	 	 	 	 	 t e s t _ d e s c r i p t i o n :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t e s t _ n a m e :   s t r i n g ;  
 	 	 	 	 	 t e s t _ v e r s i o n :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t o u r n a m e n t _ i d :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 I n s e r t :   {  
 	 	 	 	 	 a r c h i v e d ? :   b o o l e a n ;  
 	 	 	 	 	 i d ? :   n e v e r ;  
 	 	 	 	 	 t e s t _ d e s c r i p t i o n ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t e s t _ n a m e :   s t r i n g ;  
 	 	 	 	 	 t e s t _ v e r s i o n ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t o u r n a m e n t _ i d ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 U p d a t e :   {  
 	 	 	 	 	 a r c h i v e d ? :   b o o l e a n ;  
 	 	 	 	 	 i d ? :   n e v e r ;  
 	 	 	 	 	 t e s t _ d e s c r i p t i o n ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t e s t _ n a m e ? :   s t r i n g ;  
 	 	 	 	 	 t e s t _ v e r s i o n ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t o u r n a m e n t _ i d ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 R e l a t i o n s h i p s :   [  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " t e s t s _ t o u r n a m e n t _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " t o u r n a m e n t _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " t o u r n a m e n t s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 }  
 	 	 	 	 ] ;  
 	 	 	 } ;  
 	 	 	 t e s t s _ c o p y :   {  
 	 	 	 	 R o w :   {  
 	 	 	 	 	 i d :   n u m b e r ;  
 	 	 	 	 	 t e s t _ d e s c r i p t i o n :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t e s t _ n a m e :   s t r i n g ;  
 	 	 	 	 	 t o u r n a m e n t _ i d :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 I n s e r t :   {  
 	 	 	 	 	 i d ? :   n u m b e r ;  
 	 	 	 	 	 t e s t _ d e s c r i p t i o n ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t e s t _ n a m e :   s t r i n g ;  
 	 	 	 	 	 t o u r n a m e n t _ i d ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 U p d a t e :   {  
 	 	 	 	 	 i d ? :   n u m b e r ;  
 	 	 	 	 	 t e s t _ d e s c r i p t i o n ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t e s t _ n a m e ? :   s t r i n g ;  
 	 	 	 	 	 t o u r n a m e n t _ i d ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 R e l a t i o n s h i p s :   [  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " t e s t s _ c o p y _ t o u r n a m e n t _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " t o u r n a m e n t _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " t o u r n a m e n t s _ c o p y " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 }  
 	 	 	 	 ] ;  
 	 	 	 } ;  
 	 	 	 t e s t s o l v e _ f e e d b a c k _ a n s w e r s :   {  
 	 	 	 	 R o w :   {  
 	 	 	 	 	 a n s w e r :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 f e e d b a c k _ q u e s t i o n :   n u m b e r ;  
 	 	 	 	 	 i d :   n u m b e r ;  
 	 	 	 	 	 t e s t s o l v e _ i d :   n u m b e r ;  
 	 	 	 	 } ;  
 	 	 	 	 I n s e r t :   {  
 	 	 	 	 	 a n s w e r ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 f e e d b a c k _ q u e s t i o n :   n u m b e r ;  
 	 	 	 	 	 i d ? :   n e v e r ;  
 	 	 	 	 	 t e s t s o l v e _ i d :   n u m b e r ;  
 	 	 	 	 } ;  
 	 	 	 	 U p d a t e :   {  
 	 	 	 	 	 a n s w e r ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 f e e d b a c k _ q u e s t i o n ? :   n u m b e r ;  
 	 	 	 	 	 i d ? :   n e v e r ;  
 	 	 	 	 	 t e s t s o l v e _ i d ? :   n u m b e r ;  
 	 	 	 	 } ;  
 	 	 	 	 R e l a t i o n s h i p s :   [  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " t e s t s o l v e _ f e e d b a c k _ a n s w e r s _ f e e d b a c k _ q u e s t i o n _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " f e e d b a c k _ q u e s t i o n " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " t e s t _ f e e d b a c k _ q u e s t i o n s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " t e s t s o l v e _ f e e d b a c k _ a n s w e r s _ t e s t s o l v e _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " t e s t s o l v e _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " t e s t s o l v e s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 }  
 	 	 	 	 ] ;  
 	 	 	 } ;  
 	 	 	 t e s t s o l v e r s :   {  
 	 	 	 	 R o w :   {  
 	 	 	 	 	 i d :   n u m b e r ;  
 	 	 	 	 	 s o l v e r _ i d :   s t r i n g ;  
 	 	 	 	 	 t e s t _ i d :   n u m b e r ;  
 	 	 	 	 } ;  
 	 	 	 	 I n s e r t :   {  
 	 	 	 	 	 i d ? :   n e v e r ;  
 	 	 	 	 	 s o l v e r _ i d :   s t r i n g ;  
 	 	 	 	 	 t e s t _ i d :   n u m b e r ;  
 	 	 	 	 } ;  
 	 	 	 	 U p d a t e :   {  
 	 	 	 	 	 i d ? :   n e v e r ;  
 	 	 	 	 	 s o l v e r _ i d ? :   s t r i n g ;  
 	 	 	 	 	 t e s t _ i d ? :   n u m b e r ;  
 	 	 	 	 } ;  
 	 	 	 	 R e l a t i o n s h i p s :   [  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " t e s t s o l v e r s _ s o l v e r _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " s o l v e r _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " u s e r s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " t e s t s o l v e r s _ s o l v e r _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " s o l v e r _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " u s e r _ s t a t s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " t e s t s o l v e r s _ t e s t _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " t e s t _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " t e s t s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 }  
 	 	 	 	 ] ;  
 	 	 	 } ;  
 	 	 	 t e s t s o l v e s :   {  
 	 	 	 	 R o w :   {  
 	 	 	 	 	 c o m p l e t e d :   b o o l e a n ;  
 	 	 	 	 	 e n d _ t i m e :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 f e e d b a c k :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 i d :   n u m b e r ;  
 	 	 	 	 	 s o l v e r _ i d :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 s t a r t _ t i m e :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t e s t _ i d :   n u m b e r ;  
 	 	 	 	 	 t e s t _ v e r s i o n :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t i m e _ e l a p s e d :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 I n s e r t :   {  
 	 	 	 	 	 c o m p l e t e d ? :   b o o l e a n ;  
 	 	 	 	 	 e n d _ t i m e ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 f e e d b a c k ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 i d ? :   n e v e r ;  
 	 	 	 	 	 s o l v e r _ i d ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 s t a r t _ t i m e ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t e s t _ i d :   n u m b e r ;  
 	 	 	 	 	 t e s t _ v e r s i o n ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t i m e _ e l a p s e d ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 U p d a t e :   {  
 	 	 	 	 	 c o m p l e t e d ? :   b o o l e a n ;  
 	 	 	 	 	 e n d _ t i m e ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 f e e d b a c k ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 i d ? :   n e v e r ;  
 	 	 	 	 	 s o l v e r _ i d ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 s t a r t _ t i m e ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t e s t _ i d ? :   n u m b e r ;  
 	 	 	 	 	 t e s t _ v e r s i o n ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t i m e _ e l a p s e d ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 R e l a t i o n s h i p s :   [  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " t e s t s o l v e s _ s o l v e r _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " s o l v e r _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " u s e r s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " t e s t s o l v e s _ s o l v e r _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " s o l v e r _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " u s e r _ s t a t s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " t e s t s o l v e s _ t e s t _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " t e s t _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " t e s t s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 }  
 	 	 	 	 ] ;  
 	 	 	 } ;  
 	 	 	 t o u r n a m e n t s :   {  
 	 	 	 	 R o w :   {  
 	 	 	 	 	 a r c h i v e d :   b o o l e a n ;  
 	 	 	 	 	 i d :   n u m b e r ;  
 	 	 	 	 	 t o u r n a m e n t _ d a t e :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t o u r n a m e n t _ n a m e :   s t r i n g ;  
 	 	 	 	 } ;  
 	 	 	 	 I n s e r t :   {  
 	 	 	 	 	 a r c h i v e d ? :   b o o l e a n ;  
 	 	 	 	 	 i d ? :   n e v e r ;  
 	 	 	 	 	 t o u r n a m e n t _ d a t e ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t o u r n a m e n t _ n a m e :   s t r i n g ;  
 	 	 	 	 } ;  
 	 	 	 	 U p d a t e :   {  
 	 	 	 	 	 a r c h i v e d ? :   b o o l e a n ;  
 	 	 	 	 	 i d ? :   n e v e r ;  
 	 	 	 	 	 t o u r n a m e n t _ d a t e ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t o u r n a m e n t _ n a m e ? :   s t r i n g ;  
 	 	 	 	 } ;  
 	 	 	 	 R e l a t i o n s h i p s :   [ ] ;  
 	 	 	 } ;  
 	 	 	 t o u r n a m e n t s _ c o p y :   {  
 	 	 	 	 R o w :   {  
 	 	 	 	 	 i d :   n u m b e r ;  
 	 	 	 	 	 t o u r n a m e n t _ d a t e :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t o u r n a m e n t _ n a m e :   s t r i n g ;  
 	 	 	 	 } ;  
 	 	 	 	 I n s e r t :   {  
 	 	 	 	 	 i d ? :   n u m b e r ;  
 	 	 	 	 	 t o u r n a m e n t _ d a t e ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t o u r n a m e n t _ n a m e :   s t r i n g ;  
 	 	 	 	 } ;  
 	 	 	 	 U p d a t e :   {  
 	 	 	 	 	 i d ? :   n u m b e r ;  
 	 	 	 	 	 t o u r n a m e n t _ d a t e ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t o u r n a m e n t _ n a m e ? :   s t r i n g ;  
 	 	 	 	 } ;  
 	 	 	 	 R e l a t i o n s h i p s :   [ ] ;  
 	 	 	 } ;  
 	 	 	 u s e r _ r o l e s :   {  
 	 	 	 	 R o w :   {  
 	 	 	 	 	 r o l e :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 u s e r _ i d :   s t r i n g ;  
 	 	 	 	 } ;  
 	 	 	 	 I n s e r t :   {  
 	 	 	 	 	 r o l e ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 u s e r _ i d :   s t r i n g ;  
 	 	 	 	 } ;  
 	 	 	 	 U p d a t e :   {  
 	 	 	 	 	 r o l e ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 u s e r _ i d ? :   s t r i n g ;  
 	 	 	 	 } ;  
 	 	 	 	 R e l a t i o n s h i p s :   [  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " u s e r _ r o l e s _ u s e r _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " u s e r _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " u s e r s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " u s e r _ r o l e s _ u s e r _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " u s e r _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " u s e r _ s t a t s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 }  
 	 	 	 	 ] ;  
 	 	 	 } ;  
 	 	 	 u s e r _ r o l e s _ c o p y :   {  
 	 	 	 	 R o w :   {  
 	 	 	 	 	 r o l e :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 u s e r _ i d :   s t r i n g ;  
 	 	 	 	 } ;  
 	 	 	 	 I n s e r t :   {  
 	 	 	 	 	 r o l e ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 u s e r _ i d :   s t r i n g ;  
 	 	 	 	 } ;  
 	 	 	 	 U p d a t e :   {  
 	 	 	 	 	 r o l e ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 u s e r _ i d ? :   s t r i n g ;  
 	 	 	 	 } ;  
 	 	 	 	 R e l a t i o n s h i p s :   [  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " u s e r _ r o l e s _ c o p y _ u s e r _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " u s e r _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " u s e r s _ c o p y " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 }  
 	 	 	 	 ] ;  
 	 	 	 } ;  
 	 	 	 u s e r s :   {  
 	 	 	 	 R o w :   {  
 	 	 	 	 	 a m c _ s c o r e :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 d i s c o r d :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 d i s c o r d _ i d :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 d i s c o r d _ t o k e n s :   J s o n   |   n u l l ;  
 	 	 	 	 	 e m a i l :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 f u l l _ n a m e :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 i d :   s t r i n g ;  
 	 	 	 	 	 i n i t i a l s :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 m a t h _ c o m p _ b a c k g r o u n d :   s t r i n g ;  
 	 	 	 	 } ;  
 	 	 	 	 I n s e r t :   {  
 	 	 	 	 	 a m c _ s c o r e ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 d i s c o r d ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 d i s c o r d _ i d ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 d i s c o r d _ t o k e n s ? :   J s o n   |   n u l l ;  
 	 	 	 	 	 e m a i l ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 f u l l _ n a m e ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 i d :   s t r i n g ;  
 	 	 	 	 	 i n i t i a l s ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 m a t h _ c o m p _ b a c k g r o u n d ? :   s t r i n g ;  
 	 	 	 	 } ;  
 	 	 	 	 U p d a t e :   {  
 	 	 	 	 	 a m c _ s c o r e ? :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 d i s c o r d ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 d i s c o r d _ i d ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 d i s c o r d _ t o k e n s ? :   J s o n   |   n u l l ;  
 	 	 	 	 	 e m a i l ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 f u l l _ n a m e ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 i d ? :   s t r i n g ;  
 	 	 	 	 	 i n i t i a l s ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 m a t h _ c o m p _ b a c k g r o u n d ? :   s t r i n g ;  
 	 	 	 	 } ;  
 	 	 	 	 R e l a t i o n s h i p s :   [  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " u s e r s _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " u s e r s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 }  
 	 	 	 	 ] ;  
 	 	 	 } ;  
 	 	 	 u s e r s _ c o p y :   {  
 	 	 	 	 R o w :   {  
 	 	 	 	 	 d i s c o r d :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 f u l l _ n a m e :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 i d :   s t r i n g ;  
 	 	 	 	 	 i n i t i a l s :   s t r i n g   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 I n s e r t :   {  
 	 	 	 	 	 d i s c o r d ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 f u l l _ n a m e ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 i d :   s t r i n g ;  
 	 	 	 	 	 i n i t i a l s ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 U p d a t e :   {  
 	 	 	 	 	 d i s c o r d ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 f u l l _ n a m e ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 i d ? :   s t r i n g ;  
 	 	 	 	 	 i n i t i a l s ? :   s t r i n g   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 R e l a t i o n s h i p s :   [  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " u s e r s _ c o p y _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " u s e r s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 }  
 	 	 	 	 ] ;  
 	 	 	 } ;  
 	 	 } ;  
 	 	 V i e w s :   {  
 	 	 	 f r o n t _ i d s :   {  
 	 	 	 	 R o w :   {  
 	 	 	 	 	 f r o n t _ i d :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 p r o b l e m _ i d :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 R e l a t i o n s h i p s :   [ ] ;  
 	 	 	 } ;  
 	 	 	 f u l l _ p r o b l e m s :   {  
 	 	 	 	 R o w :   {  
 	 	 	 	 	 a n s w e r _ l a t e x :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 a r c h i v e d :   b o o l e a n   |   n u l l ;  
 	 	 	 	 	 a u t h o r _ i d :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 c o m m e n t _ l a t e x :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 c r e a t e d _ a t :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 d i f f i c u l t y :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 e d i t e d _ a t :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 f r o n t _ i d :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 f u l l _ n a m e :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 i d :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 n i c k n a m e :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 p r o b l e m _ l a t e x :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 p r o b l e m _ t e s t s :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 s o l u t i o n _ l a t e x :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 s u b _ t o p i c s :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t o p i c s :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t o p i c s _ s h o r t :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 u n r e s o l v e d _ c o u n t :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 R e l a t i o n s h i p s :   [  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " p r o b l e m s _ a u t h o r _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " a u t h o r _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " u s e r s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " p r o b l e m s _ a u t h o r _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " a u t h o r _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " u s e r _ s t a t s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 }  
 	 	 	 	 ] ;  
 	 	 	 } ;  
 	 	 	 p r o b l e m _ c o u n t s :   {  
 	 	 	 	 R o w :   {  
 	 	 	 	 	 c a t e g o r y :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 p r o b l e m _ c o u n t :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 R e l a t i o n s h i p s :   [ ] ;  
 	 	 	 } ;  
 	 	 	 u n u s e d _ p r o b l e m s :   {  
 	 	 	 	 R o w :   {  
 	 	 	 	 	 a n s w e r _ l a t e x :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 a u t h o r _ i d :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 c o m m e n t _ l a t e x :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 c r e a t e d _ a t :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 d i f f i c u l t y :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 e d i t e d _ a t :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 f r o n t _ i d :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 f u l l _ n a m e :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 i d :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 n i c k n a m e :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 p r o b l e m _ l a t e x :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 s o l u t i o n _ l a t e x :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 s u b _ t o p i c s :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t o p i c s :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 t o p i c s _ s h o r t :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 u n r e s o l v e d _ c o u n t :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 R e l a t i o n s h i p s :   [  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " p r o b l e m s _ a u t h o r _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " a u t h o r _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " u s e r s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 } ,  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " p r o b l e m s _ a u t h o r _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " a u t h o r _ i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " u s e r _ s t a t s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 }  
 	 	 	 	 ] ;  
 	 	 	 } ;  
 	 	 	 u s e r _ s t a t s :   {  
 	 	 	 	 R o w :   {  
 	 	 	 	 	 d i s c o r d _ i d :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 i d :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 n a m e :   s t r i n g   |   n u l l ;  
 	 	 	 	 	 p r o b l e m _ c o u n t :   n u m b e r   |   n u l l ;  
 	 	 	 	 	 u n r e s o l v e d _ c o u n t :   n u m b e r   |   n u l l ;  
 	 	 	 	 } ;  
 	 	 	 	 R e l a t i o n s h i p s :   [  
 	 	 	 	 	 {  
 	 	 	 	 	 	 f o r e i g n K e y N a m e :   " u s e r s _ i d _ f k e y " ;  
 	 	 	 	 	 	 c o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 	 r e f e r e n c e d R e l a t i o n :   " u s e r s " ;  
 	 	 	 	 	 	 r e f e r e n c e d C o l u m n s :   [ " i d " ] ;  
 	 	 	 	 	 }  
 	 	 	 	 ] ;  
 	 	 	 } ;  
 	 	 } ;  
 	 	 F u n c t i o n s :   {  
 	 	 	 a d d _ t e s t _ p r o b l e m :   {  
 	 	 	 	 A r g s :   {  
 	 	 	 	 	 p _ p r o b l e m _ i d :   n u m b e r ;  
 	 	 	 	 	 p _ t e s t _ i d :   n u m b e r ;  
 	 	 	 	 } ;  
 	 	 	 	 R e t u r n s :   u n d e f i n e d ;  
 	 	 	 } ;  
 	 	 	 d e l e t e _ t e s t _ p r o b l e m :  
 	 	 	 	 |   {  
 	 	 	 	 	 	 A r g s :   {  
 	 	 	 	 	 	 	 p _ p r o b l e m _ i d :   n u m b e r ;  
 	 	 	 	 	 	 	 c u r _ t e s t _ i d :   n u m b e r ;  
 	 	 	 	 	 	 } ;  
 	 	 	 	 	 	 R e t u r n s :   u n d e f i n e d ;  
 	 	 	 	     }  
 	 	 	 	 |   {  
 	 	 	 	 	 	 A r g s :   {  
 	 	 	 	 	 	 	 p _ p r o b l e m _ i d :   n u m b e r ;  
 	 	 	 	 	 	 } ;  
 	 	 	 	 	 	 R e t u r n s :   u n d e f i n e d ;  
 	 	 	 	     } ;  
 	 	 	 r e o r d e r _ t e s t _ p r o b l e m :  
 	 	 	 	 |   {  
 	 	 	 	 	 	 A r g s :   {  
 	 	 	 	 	 	 	 p _ p r o b l e m _ i d :   n u m b e r ;  
 	 	 	 	 	 	 	 p _ n e w _ n u m b e r :   n u m b e r ;  
 	 	 	 	 	 	 	 c u r _ t e s t _ i d :   n u m b e r ;  
 	 	 	 	 	 	 } ;  
 	 	 	 	 	 	 R e t u r n s :   u n d e f i n e d ;  
 	 	 	 	     }  
 	 	 	 	 |   {  
 	 	 	 	 	 	 A r g s :   {  
 	 	 	 	 	 	 	 p _ p r o b l e m _ i d :   n u m b e r ;  
 	 	 	 	 	 	 	 p _ n e w _ n u m b e r :   n u m b e r ;  
 	 	 	 	 	 	 } ;  
 	 	 	 	 	 	 R e t u r n s :   u n d e f i n e d ;  
 	 	 	 	     } ;  
 	 	 } ;  
 	 	 E n u m s :   {  
 	 	 	 [ _   i n   n e v e r ] :   n e v e r ;  
 	 	 } ;  
 	 	 C o m p o s i t e T y p e s :   {  
 	 	 	 [ _   i n   n e v e r ] :   n e v e r ;  
 	 	 } ;  
 	 } ;  
 }  
 