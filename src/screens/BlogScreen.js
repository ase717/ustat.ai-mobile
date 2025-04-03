import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Text, Card, Chip, ActivityIndicator, Searchbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPostsStart, fetchPostsSuccess, fetchPostsFailure } from '../redux/blogSlice';
import Header from '../components/Header';
import colors from '../theme/colors';

const BlogScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { posts = [], loading = false, error = null } = useSelector(state => state.blog || {});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Mock categories
  const categories = [
    { id: 'all', name: 'Tümü' },
    { id: 'is-hukuku', name: 'İş Hukuku' },
    { id: 'ticaret-hukuku', name: 'Ticaret Hukuku' },
    { id: 'ceza-hukuku', name: 'Ceza Hukuku' },
    { id: 'vergi-hukuku', name: 'Vergi Hukuku' },
  ];

  // Mock blog posts
  const mockPosts = [
    {
      id: 1,
      title: 'İş Hukukunda Yeni Düzenlemeler',
      excerpt: 'İş hukukunda yapılan son değişiklikler ve çalışanları etkileyecek yeni düzenlemeler hakkında bilmeniz gerekenler.',
      image: 'https://source.unsplash.com/random/400x200/?law',
      date: '22 Mart 2025',
      author: 'Av. Mehmet Yılmaz',
      category: 'is-hukuku',
      readTime: '5 dk'
    },
    {
      id: 2,
      title: 'Ticari Sözleşmelerde Dikkat Edilmesi Gerekenler',
      excerpt: 'Ticari sözleşme hazırlarken dikkat edilmesi gereken hususlar ve yaygın hatalar.',
      image: 'https://source.unsplash.com/random/400x200/?contract',
      date: '15 Mart 2025',
      author: 'Av. Ayşe Kaya',
      category: 'ticaret-hukuku',
      readTime: '7 dk'
    },
    {
      id: 3,
      title: 'Vergi Beyannamesi Hazırlarken Dikkat Edilmesi Gerekenler',
      excerpt: 'Vergi beyannamesi hazırlarken dikkat edilmesi gereken önemli noktalar ve uygulamalar.',
      image: 'https://source.unsplash.com/random/400x200/?tax',
      date: '10 Mart 2025',
      author: 'Av. Hasan Demir',
      category: 'vergi-hukuku',
      readTime: '6 dk'
    },
  ];

  useEffect(() => {
    // Fetch blog posts
    const fetchPosts = async () => {
      try {
        dispatch(fetchPostsStart());
        
        // Mock API call with timeout
        setTimeout(() => {
          dispatch(fetchPostsSuccess(mockPosts));
        }, 1000);
        
      } catch (error) {
        dispatch(fetchPostsFailure(error.message));
      }
    };

    fetchPosts();
  }, [dispatch]);

  // Filter posts based on search query and active category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <View style={styles.container}>
      <Header title="Blog" />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Blog yazılarında ara..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            iconColor={colors.primary.main}
          />
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScrollView}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <Chip
              key={category.id}
              selected={activeCategory === category.id}
              mode="outlined"
              style={[
                styles.categoryChip,
                activeCategory === category.id && styles.activeCategoryChip
              ]}
              textStyle={[
                styles.categoryChipText,
                activeCategory === category.id && styles.activeCategoryChipText
              ]}
              onPress={() => setActiveCategory(category.id)}
            >
              {category.name}
            </Chip>
          ))}
        </ScrollView>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary.main} />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Bir hata oluştu: {error}</Text>
          </View>
        ) : (
          <View style={styles.postsContainer}>
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <TouchableOpacity 
                  key={post.id}
                  onPress={() => navigation.navigate('BlogPost', { postId: post.id })}
                  activeOpacity={0.9}
                >
                  <Card style={styles.postCard}>
                    <Image source={{ uri: post.image }} style={styles.postImage} />
                    <Card.Content style={styles.postContent}>
                      <View style={styles.postMeta}>
                        <Text style={styles.postCategory}>
                          {categories.find(c => c.id === post.category)?.name || 'Genel'}
                        </Text>
                        <Text style={styles.postReadTime}>{post.readTime} okuma</Text>
                      </View>
                      <Text style={styles.postTitle}>{post.title}</Text>
                      <Text style={styles.postExcerpt} numberOfLines={2}>{post.excerpt}</Text>
                      <View style={styles.postFooter}>
                        <Text style={styles.postAuthor}>{post.author}</Text>
                        <Text style={styles.postDate}>{post.date}</Text>
                      </View>
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Aradığınız kriterlere uygun blog yazısı bulunamadı.
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: colors.primary.main,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: colors.common.white,
    borderRadius: 8,
  },
  categoriesScrollView: {
    maxHeight: 60,
  },
  categoriesContainer: {
    padding: 16,
    paddingTop: 0,
  },
  categoryChip: {
    marginRight: 8,
    borderColor: colors.primary.main,
  },
  activeCategoryChip: {
    backgroundColor: colors.primary.main,
  },
  categoryChipText: {
    color: colors.primary.main,
  },
  activeCategoryChipText: {
    color: colors.common.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
  },
  errorText: {
    color: colors.error.main,
    textAlign: 'center',
  },
  postsContainer: {
    padding: 16,
  },
  postCard: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  postImage: {
    width: '100%',
    height: 180,
  },
  postContent: {
    padding: 12,
  },
  postMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  postCategory: {
    fontSize: 12,
    color: colors.primary.main,
    fontWeight: 'bold',
  },
  postReadTime: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  postExcerpt: {
    color: colors.text.secondary,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.grey[200],
    paddingTop: 12,
    marginTop: 4,
  },
  postAuthor: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  postDate: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.text.secondary,
  },
});

export default BlogScreen;